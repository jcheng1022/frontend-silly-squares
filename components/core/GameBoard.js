'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {useCurrentUser} from "@/hooks/user.hooks";
import LobbyRoom from "@/components/core/LobbyRoom";
import {GAME_STATE} from "@/constants";
import {useGame} from "@/hooks/games.hooks";

// const GAME_STATE = {
//     WAITING_JOIN: 'waiting-join',
//     WAITING_READY: 'waiting-ready',
//     PLAYING: 'playing',
//     GAME_OVER: 'game-over'
//
// }
const GameBoard = ({participants, channel}) => {

    const {gameId} = useParams();
    const {data: game} = useGame(gameId)
    const {data: user} = useCurrentUser();




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



    // subscribed to the game channel
    // const { channel } = useChannel(`game-room-${gameId}`, async (message) => {
    //
    //     // handle all the channel events here
    //
    //     if (message.name === 'game-status-update') {
    //         await queryClient.refetchQueries({
    //             queryKey: ['game', gameId]
    //         })
    //     }
    //
    //     if (message.name === 'joining-game') {
    //
    //         await queryClient.refetchQueries({
    //             queryKey: ['game-room-players', gameId]
    //         })
    //
    //         //
    //         // if (!players?.playerOne ) {
    //         //     setPlayers((prev) => {
    //         //         return {
    //         //             ...prev,
    //         //             playerOne: message.data
    //         //         }
    //         //     })
    //         // } else if (!players?.playerTwo) {
    //         //     setPlayers((prev) => {
    //         //         return {
    //         //             ...prev,
    //         //             playerTwo: message.data
    //         //         }
    //         //     })
    //         // } else {
    //         //     // this should never be hit tbh
    //         //     console.log('game is full, how did you get here')
    //         // }
    //     }
    //
    //
    //     // if (message.name === 'opponent-movement') {
    //     //     console.log(`opponent movement trigger, new position: ${message.data.newPosition}`)
    //     //     // console.log('opponent-movement', message.data)
    //     //     setCombinedBoard((prev) => {
    //     //
    //     //         const newBoardState = prev.map((space, index) => {
    //     //
    //     //             if (position === index + 1) {
    //     //                 return {
    //     //                     ...space,
    //     //                     isOccupied: player === 1 ? 2 : 1
    //     //                 };
    //     //             }
    //     //             return space;
    //     //         });
    //     //
    //     //         return newBoardState
    //     //     })
    //     // }
    //
    //     // console.log(message, 'channel mstuffs')
    //     // updateMessages((prev) => [...prev, message]);
    // });




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

    useEffect(() => {
        if (!isInitialized || !player) return;

        const handleMovement = (e) => {
            e.preventDefault();

            const currentPosition = player.value === 1 ? playerOnePosition : playerTwoPosition;
            const updatePosition = player.value === 1 ? setPlayerOnePosition : setPlayerTwoPosition;

            let newPosition = currentPosition;

            // Handle Arrow Key Movements
            if (e.key === 'ArrowDown' && currentPosition <= 50) {
                newPosition += 10;
            } else if (e.key === 'ArrowUp' && currentPosition > 10) {
                newPosition -= 10;
            } else if (e.key === 'ArrowLeft' && currentPosition % 10 !== 1) {
                newPosition -= 1;
            } else if (e.key === 'ArrowRight' && currentPosition % 10 !== 0) {
                newPosition += 1;
            }

            // Only update if the position has changed
            if (newPosition !== currentPosition) {
                updatePosition(newPosition);

                // Update combined board with the new player position
                setCombinedBoard((prev) => {
                    const updatedBoard = prev.map((space, index) => {
                        if (index + 1 === newPosition) {
                            return { ...space, isOccupied: player.value };
                        }
                        return space;
                    });
                    return updatedBoard;
                });

                // Broadcast movement to other players
                channel.publish('opponent-movement', {
                    player: player.value,
                    newPosition: newPosition
                });
            }
        };

        // Add event listener for keydown
        document.addEventListener('keydown', handleMovement);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleMovement);
        };
    }, [playerOnePosition, playerTwoPosition, player, combinedBoard]);



    let body;
    if (game?.status === GAME_STATE.WAITING_JOIN) {

            body = (
                <LobbyRoom participants={participants} />
            )

    }

    if (game?.status === GAME_STATE.WAITING_READY) {
        const userIsReady = participants?.playerOne?.id === user?.id ? !!participants?.playerOne?.isReady : participants?.playerTwo?.isReady
            body = (
                <LobbyRoom participants={participants} />
            )
            // body = (<div className={'flex flex-col items-center gap-8'}>
            //     <div> Waiting for both players to be ready...</div>
            //     {userIsReady ? <div> You are ready</div> : <ReadyUp />}
            // </div>)

    }


    const selfPlayer = participants?.playerOne?.id === user?.id ? PLAYER_DETAILS.PLAYER_ONE : PLAYER_DETAILS.PLAYER_TWO
    return (
        <div className={'m-8 overscroll-none'}>
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
            <div className="grid grid-cols-10 gap-2">

                {combinedBoard?.map((space, index) => {
                    const selfPosition = selfPlayer?.value === 1 ? playerOnePosition : playerTwoPosition;
                    const updatePosition = selfPlayer?.value === 1 ? setPlayerOnePosition : setPlayerTwoPosition;

                    // const isCurrentPosition = position === index + 1;
                    const playerOneIsHovering = playerOnePosition === index + 1;
                    const playerTwoIsHovering = playerTwoPosition === index + 1;

                    const borderColor = playerOneIsHovering ? 'border-4 border-sky-800' : playerTwoIsHovering ? 'border-4 border-red-800' : 'border-4 border-slate-800'
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

};

export default GameBoard;
