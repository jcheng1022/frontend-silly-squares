'use client';

import React, {useState} from 'react';
import APIClient from "@/services/api";
import {useParams} from "next/navigation";
import {notification} from "antd";
import {useQueryClient} from "@tanstack/react-query";
import {useGameRoomPlayers} from "@/hooks/games.hooks";
import {useCurrentUser} from "@/hooks/user.hooks";

const ReadyUp = () => {
    const {gameId} = useParams();
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const client = useQueryClient()
    const {data: user} = useCurrentUser()
    const { participants } = useGameRoomPlayers(user?.id, gameId)


    const handleReady = async () => {
        await APIClient.api.patch(`/games/${gameId}/ready`).then(async () => {
            await notification.success({
                message: 'Ready',
                description: 'You are ready to play'

            })

            await client.refetchQueries({
                queryKey: ['game-room-players', gameId, {}]
            })


            if (!!participants?.playerOne?.ready && !!participants?.playerTwo?.ready) {
                await notification.success({
                    message: 'Game is ready',
                    description: 'Game is ready to start'
                })
                await client.refetchQueries({
                    queryKey: ['game-ready-status', gameId]
                })
            }

            //
            // await client.refetchQueries({
            //     queryKey: ['game-ready-status', gameId]
            // })
        })
    }
    return (
        <div>
            {contextHolder}
            <button className={'bg-sky-400 px-8 py-2 rounded'} onClick={handleReady}> Ready Up</button>
        </div>
    );
};

export default ReadyUp;
