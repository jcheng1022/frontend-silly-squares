'use client'

import React from 'react';
import GameBoard from "@/components/core/GameBoard";
import {AblyProvider, ChannelProvider} from "ably/react";
import {Realtime} from "ably";
import {GameContextProvider} from "@/context/GameContext";

const Page = ({params}) => {
    // const queryClient = useQueryClienst();

    // const {data: user} = useCurrentUser()
    // const {data: participants, isFetching, isLoading, isRefetching} = useGameRoomPlayers(user?.id, params?.gameId)
    const client = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    //
    // useEffect(() => {
    //     const notReady = !user || !participants && ((isFetching || isLoading) && !isRefetching)
    //
    //
    //     if (notReady) {
    //         return
    //     }
    //     // if there are already two players in the room, don't join
    //
    //     if (participants?.playerOne && participants?.playerTwo) {
    //         return
    //     }
    //
    //     // if already in the game
    //     if (participants?.playerOne?.id === user?.id || participants?.playerTwo?.id === user?.id) {
    //         console.log(`in game`)
    //         return
    //     }
    //
    //     const joinRoom = async () => {
    //         await APIClient.api.patch(`/games/${params?.gameId}/join`)
    //     }
    //
    //     joinRoom().then(async () => {
    //         //refetch participatns
    //         await queryClient.refetchQueries({
    //             queryKey: ['game-room-players', params?.gameId]
    //         })
    //     }).catch((e) => {
    //         console.log(`Something went wrong with joining the room: ${e?.message ?? e}`)
    //     })
    // }, [user, participants])
    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`game-room-${params.gameId}`}>
                    <GameContextProvider>
                        <GameBoard />
                    </GameContextProvider>
            </ChannelProvider>
        </AblyProvider>
    );
};

export default Page;
