'use client'

import React, {useState} from 'react';
import GameBoard from "@/components/core/GameBoard";
import {AblyProvider, ChannelProvider} from "ably/react";
import {Realtime} from "ably";

const Page = ({params}) => {

    const [messages, setMessages] = useState([]);
    const client = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });



    // useConnectionStateListener('connected', () => {
    //     console.log('Connected to Ably!');
    // });
    //
    // const { channel } = useChannel('get-started', 'first', (message) => {
    //     setMessages(previousMessages => [...previousMessages, message]);
    // });
    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`game-room-${params.gameId}`}>
                <div>
                    {/*<button onClick={() => { channel.publish('first', 'Here is my first message!') }}>*/}
                    {/*    Publish*/}
                    {/*</button>*/}
                    {/*{*/}
                    {/*    messages.map(message => {*/}
                    {/*        return <p key={message.id}>{message.data}</p>*/}
                    {/*    })*/}
                    {/*}*/}

                    <GameBoard />
                </div>
            </ChannelProvider>
        </AblyProvider>
    );
};

export default Page;
