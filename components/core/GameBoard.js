'use client';

import React, { useEffect, useState } from 'react';

const GameBoard = () => {
    const spaces = Array.from({ length: 60 }, () => ({
        isOccupied: false
    }));

    const [position, setPosition] = useState(null);
    const [boardState, setBoardState] = useState(spaces);
    const [isInitialized, setIsInitialized] = useState(false)
    const [player, setPlayer] = useState(null)


    const PLAYER_DETAILS = {
        PLAYER_ONE: {
            value: 1,
            color: "border-8 border-sky-800"
        },
        PLAYER_TWO: {
            value: 2,
            color: "border-8 border-red-800"
        }

    }

    //initialize board'
    useEffect(() => {
        if (isInitialized) return;

        // Set player first
        setPlayer(PLAYER_DETAILS.PLAYER_ONE);

        // Then calculate position after player is updated
        setPlayer((prevPlayer) => {
            const newPosition = prevPlayer?.value === 1 ? 1 : 60;
            setPosition(newPosition);
            return prevPlayer; // You can return the player state if needed
        });

        // Finally, mark as initialized
        setIsInitialized(true);
    }, []);




    useEffect(() => {


        const handleMovement = (e) => {
            e.preventDefault();

            // restrict edge movements
            if ((position % 10 === 1) && e.key === 'ArrowLeft') return
            if (position === 10 && e.key === 'ArrowUp') return
            if ((position % 10 === 0) && e.key === 'ArrowRight') return

            setPosition(prev => {
                if (e.key === 'ArrowDown' && prev < 51) {
                    return prev + 10;
                } else if (e.key === 'ArrowUp' && prev > 10) {
                    return prev - 10;
                } else if (e.key === 'ArrowLeft' && prev > 1) {
                    return prev - 1;
                } else if (e.key === 'ArrowRight' && prev < 60) {
                    return prev + 1;
                }
                return prev;
            });
            // if player already claimed, dont claim again
            if (boardState[position - 1].isOccupied === player?.value) return

            setBoardState((prev) => {

                const newBoardState = prev.map((space, index) => {
                    if (position === index + 1) {
                        return {
                            ...space,
                            isOccupied: player?.value
                        };
                    }
                    return space;
                });

                return newBoardState
            })
        };

        // Add event listener
        document.addEventListener('keydown', handleMovement);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleMovement);
        };
    }, [position, document]);

    if (!isInitialized) {
        return (
            <div> loading</div>
        )
    }

    return (
        <div className={'m-8'}>
            <div className={' flex gap-2 justify-center  mb-12 '}>
                <div className={'flex flex-col items-center'}>
                    <div> Player 1</div>
                    <div> {boardState?.filter(space => space.isOccupied === player?.value).length}</div>
                </div>
                <div className={'flex flex-col items-center'}>
                    <div> Player 2</div>
                    <div> {boardState?.filter(space => space.isOccupied === player?.value).length}</div>
                </div>
            </div>
            <div className="grid grid-cols-10 grid-rows-10 gap-2">

                {boardState.map((space, index) => {
                    const isCurrentPosition = position === index + 1;

                    return (
                        <div
                            key={index}
                            className={`${isCurrentPosition && `border-4 ${player?.color}`} text-black w-full h-full aspect-square ${space.isOccupied ? 'bg-sky-600' : 'bg-slate-200'}`}
                        >
                            {index + 1}
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default GameBoard;
