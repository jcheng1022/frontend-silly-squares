'use client';

import React, {useEffect, useState} from 'react';
import {useGame, useGameRoomPlayers} from "@/hooks/games.hooks";
import APIClient from "@/services/api";
import {GAME_STATE} from "@/constants";
import {notification} from "antd";
import {useCurrentUser} from "@/hooks/user.hooks";
import {useParams} from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";
import {useChannel} from "ably/react";
import LobbyRoom from "@/components/core/LobbyRoom";
import GameBoard from "@/components/core/GameBoard";
import GameStartingModal from "@/components/modals/GameStartingModal";

const GameRoom = () => {
    const {data: user} = useCurrentUser()
    const {gameId} = useParams()


    const {data: participants, isFetching, isLoading, isRefetching} = useGameRoomPlayers(user?.id, gameId)
    const bothJoined = !!participants?.playerOne?.id || !participants?.playerTwo?.id
    const [isInitialized, setIsInitialized] = useState(false)
    const [playersJoined, setPlayersJoined] = useState(false)
    const [gameIsStarting, setGameIsStarting] = useState(false)

    const {data: game} = useGame(gameId)
    const client = useQueryClient()
    const { channel } = useChannel(`game-room-${gameId}`, async (message) => {

        // handle all the channel events here

        if (message.name === "game-start") {
            await updateGameStatus(GAME_STATE.PLAYING).then(async () => {

                await client.refetchQueries({
                    queryKey: ['game', gameId, {}]
                })

                setGameIsStarting(false)
            })


        }

        if (message.name === 'player-ready') {


            await client.refetchQueries({
                queryKey: ['game-room-players', gameId, {}]
            })
        }

        if (message.name === 'both-players-ready') {
            setGameIsStarting(true)

        }

        if (message.name === 'game-status-update') {


            await client.refetchQueries({
                queryKey: ['game', gameId]
            })
        }

        if (message.name === 'joining-game') {

            await client.refetchQueries({
                queryKey: ['game-room-players', gameId]
            })

            //
            // if (!players?.playerOne ) {
            //     setPlayers((prev) => {
            //         return {
            //             ...prev,
            //             playerOne: message.data
            //         }
            //     })
            // } else if (!players?.playerTwo) {
            //     setPlayers((prev) => {
            //         return {
            //             ...prev,
            //             playerTwo: message.data
            //         }
            //     })
            // } else {
            //     // this should never be hit tbh
            //     console.log('game is full, how did you get here')
            // }
        }


        // if (message.name === 'opponent-movement') {
        //     console.log(`opponent movement trigger, new position: ${message.data.newPosition}`)
        //     // console.log('opponent-movement', message.data)
        //     setCombinedBoard((prev) => {
        //
        //         const newBoardState = prev.map((space, index) => {
        //
        //             if (position === index + 1) {
        //                 return {
        //                     ...space,
        //                     isOccupied: player === 1 ? 2 : 1
        //                 };
        //             }
        //             return space;
        //         });
        //
        //         return newBoardState
        //     })
        // }

        // console.log(message, 'channel mstuffs')
        // updateMessages((prev) => [...prev, message]);
    });

     const updateGameStatus = async (type) => {
        await APIClient.api.patch(`/games/${gameId}/status/${type}` )
    }

    useEffect(() => {
        if (!gameId) return;

        const notReady = !user || (!participants && ((isFetching || isLoading) && !isRefetching))


        if (notReady) {
            return
        }
        // if there are already two players in the room, don't join

        if (!participants?.playerOne && !participants?.playerTwo) {
            return
        }

        // if already in the game
        if (participants?.playerOne?.id === user?.id || participants?.playerTwo?.id === user?.id) {
            return
        }

        const joinRoom = async () => {
            await APIClient.api.patch(`/games/${gameId}/join`)
        }

        joinRoom().then(async () => {
            //refetch participatns
            await client.refetchQueries({
                queryKey: ['game-room-players', gameId]
            })
        }).catch((e) => {
            console.log(`Something went wrong with joining the room: ${e?.message ?? e}`)
        })
    }, [user, participants, gameId])

    useEffect(() => {

        if (!!isInitialized && !!playersJoined) {
            return;
        }
        if (!user) {
            return;
        }


        if ((game?.status === GAME_STATE.WAITING_JOIN) && (!!participants?.playerOne?.id && !!participants?.playerTwo?.id)) {
            updateGameStatus(GAME_STATE.WAITING_READY).then(async () => {

                await channel.publish("game-status-update", {})


            }).catch(e => {
                notification.error({
                    message: 'Error updating game status',
                    description: e?.message ?? "Try refreshing the page"
                })
            })
        }


        // Updating game state to PLAYING
        if (( game?.status === GAME_STATE.WAITING_READY) && (!!participants?.playerOne?.isReady && !!participants?.playerTwo?.isReady)) {

            channel.publish("both-players-ready", {})
            // const self = participants?.playerOne?.id === user?.id ? PLAYER_DETAILS.PLAYER_ONE : PLAYER_DETAILS.PLAYER_TWO
            //
            // updateGameStatus(GAME_STATE.PLAYING).then(async () => {
            //     channel.publish("game-status-update", {
            //
            //     })
            //     setPlayer(self)
            //
            //     // setGameState(GAME_STATE.WAITING_READY)
            // }).catch(e => {
            //     notification.error({
            //         message: 'Error updating game status',
            //         description: e?.message ?? "Try refreshing the page"
            //     })
            // })
            // setGameState(GAME_STATE.PLAYING)
        }

        // if (player) {
        //     // TODO: send api to update to playing
        //     // setGameState(GAME_STATE.PLAYING)
        // }


        // Set player first
        // setPlayer(playertest === '1' ? PLAYER_DETAILS.PLAYER_ONE : PLAYER_DETAILS.PLAYER_TWO)

        // // Then calculate position after player is updated
        // setPlayer((prevPlayer) => {
        //     const newPosition = prevPlayer?.value === 1 ? 1 : 60;
        //     setPosition(prev => {
        //         return {
        //             ...prev,
        //             [prevPlayer?.value === 1 ? 'one' : 'two']: newPosition
        //         }
        //     });
        //     return prevPlayer; // You can return the player state if needed
        // });

        channel.publish('joining-game', {
            user: user?.firebaseUuid,
            name: user?.name
        })

        // channel.publish(`opponent-movement`, {
        //     player: player?.value,
        //     newPosition: playertest === '1' ? 60 : 1
        // })


        // Finally, mark as initialized

        setIsInitialized(true);


    }, [game, user, isInitialized, participants]);


    let body;
    if (game?.status === GAME_STATE.WAITING_JOIN || game?.status === GAME_STATE.WAITING_READY) {

        body = (
            <>
                <LobbyRoom/>

                {gameIsStarting && (
                    <GameStartingModal open={gameIsStarting} channel={channel} />
                )}

            </>

        )

    }
    //
    // if (game?.status === GAME_STATE.WAITING_READY) {
    //     const userIsReady = participants?.playerOne?.id === user?.id ? !!participants?.playerOne?.isReady : participants?.playerTwo?.isReady
    //     body = (
    //         <LobbyRoom participants={participants} />
    //     )
    //     // body = (<div className={'flex flex-col items-center gap-8'}>
    //     //     <div> Waiting for both players to be ready...</div>
    //     //     {userIsReady ? <div> You are ready</div> : <ReadyUp />}
    //     // </div>)
    //
    // }

    if (game?.status === GAME_STATE.PLAYING) {
        return <GameBoard participants={participants} channel={channel} />
    }


    // if (!isInitialized) {
    //     return (
    //         <div> Getting your game board set up...</div>
    //     )
    // }

    // if (!playersAreReady) {
    //     const userIsReady = participants?.playerOne?.id === user?.id ? participants?.playerOne?.isReady : participants?.playerTwo?.isReady
    //     return (
    //         <div className={'flex flex-col items-center gap-8'}>
    //             <div> Waiting for both players to be ready...</div>
    //             {userIsReady ? <div> You are ready</div> : <ReadyUp />}
    //         </div>
    //     )
    // }



    return body
};

export default GameRoom;
