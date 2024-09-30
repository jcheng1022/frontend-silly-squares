'use client'

import {createContext, useContext, useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useCurrentUser} from "@/hooks/user.hooks";
import APIClient from "@/services/api";
import {useGameReadyStatuses, useGameRoomPlayers} from "@/hooks/games.hooks";
import {useParams, useSearchParams} from "next/navigation";

export const GameContext = createContext({});

export const useGameContext = () => useContext(GameContext);


export const GameContextProvider = ({
                                        children,
                                    }) => {
    const queryClient = useQueryClient();

    const {data: user} = useCurrentUser()
    const {gameId} = useParams()
    // const gameId = search.get("gameId")
    const {data: participants, isFetching, isLoading, isRefetching} = useGameRoomPlayers(user?.id, gameId)
    const [playersJoined, setPlayersJoined] = useState(false)

    const bothJoined = !!participants?.playerOne?.id || !participants?.playerTwo?.id

    const {data: ready}  = useGameReadyStatuses(bothJoined, gameId)





    useEffect(() => {
        console.log(`sbhhijsdbijdnbjsn`)
        if (!gameId) return;
        console.log(`game id exists`)

        const notReady = !user || (!participants && ((isFetching || isLoading) && !isRefetching))


        if (notReady) {
            return
        }
        console.log(`ready to join`)
        // if there are already two players in the room, don't join

        if (!participants?.playerOne && !participants?.playerTwo) {
            console.log(`existinggssds`, participants)
            return
        }
        console.log(`players exist`)

        // if already in the game
        if (participants?.playerOne?.id === user?.id || participants?.playerTwo?.id === user?.id) {
            console.log(`in game`)
            return
        }
        console.log(`ok should jkoin`)

        const joinRoom = async () => {
            await APIClient.api.patch(`/games/${gameId}/join`)
        }

        joinRoom().then(async () => {
            //refetch participatns
            await queryClient.refetchQueries({
                queryKey: ['game-room-players', gameId]
            })
        }).catch((e) => {
            console.log(`Something went wrong with joining the room: ${e?.message ?? e}`)
        })
    }, [user, participants, gameId])

    const settings = {
        participants,
        playersAreReady: ready?.playersAreReady
    }




    return (
        <GameContext.Provider value={settings}>

            {children}

        </GameContext.Provider>
    );
};
