'use client'

import React from 'react';
import {AblyProvider, ChannelProvider} from "ably/react";
import {getRealtimeClient} from "@/services/realtime";
import GameRoom from "@/components/core/GameRoom";

const Page = ({params}) => {

    return (
        <AblyProvider client={getRealtimeClient()}>
            <ChannelProvider channelName={`game-room-${params.gameId}`}>
                    {/*<GameContextProvider>*/}
                        <GameRoom />
                    {/*</GameContextProvider>*/}
            </ChannelProvider>
        </AblyProvider>
    );
};

export default Page;
