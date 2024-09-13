'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useSearchParams} from "next/navigation";
import {Realtime} from "ably";
import {AblyProvider, ChannelProvider, useChannel, useConnectionStateListener} from "ably/react";
import {useCurrentUser} from "@/hooks/user.hooks";

const GameBoard = () => {

    const {gameId} = useParams();
    const {data: user} = useCurrentUser();
    const search = useSearchParams()

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



    const client = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY, clientId: `testing` });
    useConnectionStateListener('connected', () => {
        console.log('Connected to Ably!');
    });

    // subscribed to the game channel
    const { channel } = useChannel(`game-room-${gameId}`, (message) => {

        // handle all the channel events here

        if (message.name === 'joining-game') {
            console.log(`user ${message.data.name} joined the game`)

            if (!players?.playerOne ) {
                setPlayers((prev) => {
                    return {
                        ...prev,
                        playerOne: message.data
                    }
                })
            } else if (!players?.playerTwo) {
                setPlayers((prev) => {
                    return {
                        ...prev,
                        playerTwo: message.data
                    }
                })
            } else {
                // this should never be hit tbh
                console.log('game is full, how did you get here')
            }
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


    console.log(players, 'players')


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
        if (isInitialized) return;
        if (!user) return


        // Set player first
        setPlayer(playertest === '1' ? PLAYER_DETAILS.PLAYER_ONE : PLAYER_DETAILS.PLAYER_TWO)

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


    }, [user]);




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

    if (!isInitialized) {
        return (
            <div> loading</div>
        )
    }


    // console.log(combinedBoard, 'combined')
    return (
        <AblyProvider client={client}>
            <ChannelProvider name={`game-room-${gameId}`}>
                <div className={'m-8'}>
                    <div className={' flex gap-2 justify-center  mb-12 '}>
                        <div className={'flex flex-col items-center'}>
                            <div> {`Player 1 ${players?.playerOne?.name}`}</div>
                            <div> {boardState?.filter(space => space.isOccupied === player?.value).length}</div>
                        </div>
                        <div className={'flex flex-col items-center'}>
                            <div> {`Player 2 ${players?.playerTwo?.name}`}</div>
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

                            // console.log(occupiedColor, 'color', space.isOccupied)

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
            </ChannelProvider>
        </AblyProvider>

    );
};

export default GameBoard;
