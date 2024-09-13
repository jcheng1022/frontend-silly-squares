'use client'

import React, {useEffect, useState} from 'react';
import GameBoard from "@/components/core/GameBoard";
import {AblyProvider, ChannelProvider} from "ably/react";
import {Realtime} from "ably";
import {useCurrentUser} from "@/hooks/user.hooks";
import APIClient from "@/services/api";
import {useGameRoomPlayers} from "@/hooks/games.hooks";

const Page = ({params}) => {

    const [messages, setMessages] = useState([]);
    const {data: user} = useCurrentUser()
    const {data: participants, isFetching, isLoading, isRefetching} = useGameRoomPlayers(user?.id, params?.gameId)
    const client = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

    useEffect(() => {
        const notReady = !user || !participants && ((isFetching || isLoading) && !isRefetching)


        if (notReady) {
            return
        }
        // if there are already two players in the room, don't join

        if (participants?.playerOne && participants?.playerTwo) {
            return
        }

        const joinRoom = async () => {
            await APIClient.api.patch(`/games/${params?.gameId}/join`)
        }

        joinRoom().catch((e) => {
            console.log(`Something went wrong with joining the room: ${e?.message ?? e}`)
        })
    }, [user, participants])
    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`game-room-${params.gameId}`}>
                <div>
                    <GameBoard />
                </div>
            </ChannelProvider>
        </AblyProvider>
    );
};

export default Page;
