'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from "next/navigation";
import {Realtime} from "ably";
import {AblyProvider, ChannelProvider, useChannel, useConnectionStateListener} from "ably/react";
import {useCurrentUser} from "@/hooks/user.hooks";
import {useGame, useGameRoomPlayers} from "@/hooks/games.hooks";
import {useQueryClient} from "@tanstack/react-query";
import {useGameContext} from "@/context/GameContext";
import ReadyUp from "@/components/core/ReadyUp";
import APIClient from "@/services/api";
import {notification} from "antd";

const GAME_STATE = {
    WAITING_JOIN: 'waiting-join',
    WAITING_READY: 'waiting-ready',
    PLAYING: 'playing',
    GAME_OVER: 'game-over'

}
const GameBoard = () => {

    const {gameId} = useParams();
    const {data: user} = useCurrentUser();
    // const [gameState, setGameState] = useState(GAME_STATE.WAITING_JOIN)
    const {data: game} = useGame(gameId)
    const { participants, playersAreReady } = useGameContext()
    // const {data: participants} = useGameRoomPlayers(user?.id, gameId)
    const [playersJoined, setPlayersJoined] = useState(false)
    const search = useSearchParams()
    const client = useQueryClient()

    const [players, setPlayers] = useState({

    })
    const playertest = search.get('player')

    const initBoardState = Array.from({ length: 60 }, () => ({
        isOccupied: false
    }));
    const [board, setBoard] = useState(Array.from({ length: 60 }, () => ({
        isOccupied: false
    })))

    const [playerOnePosition, setPlayerOnePosition] = useState(1)
    const [playerTwoPosition, setPlayerTwoPosition] = useState(60)
    const [boardState, setBoardState] = useState(initBoardState);
    const [isInitialized, setIsInitialized] = useState(false)
    const [player, setPlayer] = useState(null)


    const [combinedBoard, setCombinedBoard] = useState(Array.from({ length: 60 }, () => ({
        isOccupied: false
    })))



    const queryClient = useQueryClient();
    // subscribed to the game channel
    const { channel } = useChannel(`game-room-${gameId}`, async (message) => {

        // handle all the channel events here

        if (message.name === 'game-status-update') {
            await queryClient.refetchQueries({
                queryKey: ['game', gameId]
            })
        }

        if (message.name === 'joining-game') {

            await queryClient.refetchQueries({
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




    const PLAYER_DETAILS = {
        PLAYER_ONE: {
            value: 1,
            border: "border-8 border-sky-800",
            color: "bg-sky-300"
        },
        PLAYER_TWO: {
            value: 2,
            border: "border-8 border-red-800",
            color: "bg-red-300"

        }

    }

    //initialize board
    useEffect(() => {

        console.log(isInitialized, user, 'is this bineg hit')
        if (!!isInitialized && !!playersJoined) {
            console.log(`exiting bc already initialized`)
            return;
        }
        if (!user) {
            console.log(`no user`)
            return;
        }

        const updateGameStatus = async (type) => {
            await APIClient.api.patch(`/games/${gameId}/status/${type}` )
        }
        if ((game?.status === GAME_STATE.WAITING_JOIN) && (!!participants?.playerOne?.id && !!participants?.playerTwo?.id)) {
            updateGameStatus(GAME_STATE.WAITING_READY).then(async () => {

                channel.publish("game-status-update", {})


            }).catch(e => {
                notification.error({
                    message: 'Error updating game status',
                    description: e?.message ?? "Try refreshing the page"
                })
            })
        }


        // Updating game state to PLAYING
        if (( game?.status === GAME_STATE.WAITING_READY) && (!!participants?.playerOne?.isReady && !!participants?.playerTwo?.isReady)) {
            const self = participants?.playerOne?.id === user?.id ? PLAYER_DETAILS.PLAYER_ONE : PLAYER_DETAILS.PLAYER_TWO

            updateGameStatus(GAME_STATE.PLAYING).then(async () => {
                channel.publish("game-status-update", {

                })
                setPlayer(self)

                // setGameState(GAME_STATE.WAITING_READY)
            }).catch(e => {
                notification.error({
                    message: 'Error updating game status',
                    description: e?.message ?? "Try refreshing the page"
                })
            })
            // setGameState(GAME_STATE.PLAYING)
        }

        if (player) {
            // TODO: send api to update to playing
            // setGameState(GAME_STATE.PLAYING)
        }


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

        channel.publish(`opponent-movement`, {
            player: player?.value,
            newPosition: playertest === '1' ? 60 : 1
        })


        // Finally, mark as initialized

        setIsInitialized(true);


    }, [game, user, participants, isInitialized]);




    useEffect(() => {

        if (!isInitialized) return


        const handleMovement = (e) => {

            e.preventDefault();
            const selfPosition = player?.value === 1 ? playerOnePosition : playerTwoPosition;
            const updatePosition = player?.value === 1 ? setPlayerOnePosition : setPlayerTwoPosition;

            // restrict edge movements
            if ((selfPosition % 10 === 1) && e.key === 'ArrowLeft') return
            if (selfPosition === 10 && e.key === 'ArrowUp') return
            if ((selfPosition % 10 === 0) && e.key === 'ArrowRight') return
            let newPosition;

            updatePosition(prev => {
                if (e.key === 'ArrowDown' && prev < 51) {
                    newPosition = prev + 10;
                    return prev + 10;
                } else if (e.key === 'ArrowUp' && prev > 10) {
                    newPosition = prev - 10;
                    return prev - 10;
                } else if (e.key === 'ArrowLeft' && prev > 1) {
                    newPosition = prev - 1;
                    return prev - 1;
                } else if (e.key === 'ArrowRight' && prev < 60) {
                    newPosition = prev + 1;
                    return prev + 1;
                }
                newPosition = prev;
                return prev;
            });
            // if player already claimed, dont claim again
            if (combinedBoard[selfPosition - 1].isOccupied === player?.value) return

            setCombinedBoard((prev) => {

                const newBoardState = prev.map((space, index) => {
                    if (selfPosition === index + 1) {
                        return {
                            ...space,
                            isOccupied: player?.value
                        };
                    }
                    return space;
                });

                return newBoardState
            })
            channel.publish(`opponent-movement`, {
                player: player?.value,
                newPosition: newPosition
            })
        };

        // Add event listener
        document.addEventListener('keydown', handleMovement);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleMovement);
        };
    }, [playerOnePosition,playerTwoPosition]);


    let body;
    if (game?.status === GAME_STATE.WAITING_JOIN) {

            body = (
                <div> Waiting for both players to join...</div>
            )

    }

    if (game?.status === GAME_STATE.WAITING_READY) {
        const userIsReady = participants?.playerOne?.id === user?.id ? !!participants?.playerOne?.isReady : participants?.playerTwo?.isReady

            body = (<div className={'flex flex-col items-center gap-8'}>
                <div> Waiting for both players to be ready...</div>
                {userIsReady ? <div> You are ready</div> : <ReadyUp />}
            </div>)

    }

    if (game?.status === GAME_STATE.PLAYING) {
        body = (
            <div className={'m-8'}>
                <div className={' flex gap-2 justify-center  mb-12 '}>
                    <div className={'flex flex-col items-center'}>
                        <div> {`Player 1 ${participants?.playerOne?.name}`}</div>
                        <div> {boardState?.filter(space => space.isOccupied === player?.value).length}</div>
                    </div>
                    <div className={'flex flex-col items-center'}>
                        <div> {`Player 2 ${participants?.playerTwo?.name}`}</div>
                        <div> {boardState?.filter(space => space.isOccupied === player?.value).length}</div>
                    </div>
                </div>
                <div className="grid grid-cols-10 grid-rows-10 gap-2">

                    {combinedBoard?.map((space, index) => {
                        const selfPosition = player?.value === 1 ? playerOnePosition : playerTwoPosition;
                        const updatePosition = player?.value === 1 ? setPlayerOnePosition : setPlayerTwoPosition;

                        // const isCurrentPosition = position === index + 1;
                        const playerOneIsHovering = playerOnePosition === index + 1;
                        const playerTwoIsHovering = playerTwoPosition === index + 1;

                        const borderColor = playerOnePosition ? 'border-4 border-sky-800' : playerTwoPosition ? 'border-4 border-red-800' : 'border-4 border-slate-800'
                        const occupiedColor = space.isOccupied === 1
                            ? 'bg-sky-200'
                            : space.isOccupied === 2
                                ? 'bg-red-200'
                                : 'bg-slate-200';


                        return (
                            <div
                                key={index}
                                className={`${borderColor} text-black w-full h-full aspect-square ${occupiedColor}`}
                            >
                                {index + 1}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
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

export default GameBoard;
