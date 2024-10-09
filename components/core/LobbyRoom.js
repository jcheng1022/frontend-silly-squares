import React from 'react';
import {IoIosCheckmarkCircleOutline} from "react-icons/io";
import {useCurrentUser} from "@/hooks/user.hooks";
import ReadyUp from "@/components/core/ReadyUp";
import {useParams} from "next/navigation";
import {useChannel} from "ably/react";
import {useGameContext} from "@/context/GameContext";

const LobbyRoom = ({}) => {
    const {data: user} = useCurrentUser()
    const {participants} = useGameContext()
    const {gameId} = useParams();

    const userIsReady = participants?.playerOne?.id === user?.id ? !!participants?.playerOne?.isReady : participants?.playerTwo?.isReady


    const { channel } = useChannel(`game-room-${gameId}`, async (message) => {

        if (message.name === 'both-players-ready') {
            console.log(`both players ready`)
            // await client.refetchQueries({
            //     queryKey: ['game-room-players', gameId, {}]
            // })
        }
    })
        return (
        <div className={'w-full flex flex-col gap-12 items-center'}>
            {/*<div>*/}
            {/*    Waiting for both players to join...*/}
            {/*</div>*/}

            <div className={' rounded-xl bg-slate-800 border-2 border-white min-w-96 p-2 '}>

                <div className={'flex gap-4 font-semibold text-lg'}>
                    <div> Players </div>
                </div>
                <div>
                    <div className={'flex justify-between'}>
                        <span>  {participants?.playerOne?.name}</span>
                        <span> {participants?.playerOne?.isReady && <IoIosCheckmarkCircleOutline color={'green'} size={24} /> }</span>
                    </div>
                    <div className={'flex justify-between'}>
                        <span>  {participants?.playerTwo?.name}</span>
                        <span> {participants?.playerTwo?.isReady && <IoIosCheckmarkCircleOutline color={'green'} size={24} /> }</span>
                    </div>
                </div>
            </div>
            {userIsReady ? <div> You are ready</div> : <ReadyUp />}


        </div>
    );
};

export default LobbyRoom;
