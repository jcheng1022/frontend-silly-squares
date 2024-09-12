'use client'

import React, {useState} from 'react';
import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';
import GameBoard from "@/components/core/GameBoard";

const Page = () => {

    const [messages, setMessages] = useState([]);


    useConnectionStateListener('connected', () => {
        console.log('Connected to Ably!');
    });

    const { channel } = useChannel('get-started', 'first', (message) => {
        setMessages(previousMessages => [...previousMessages, message]);
    });
    return (
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
    );
};

export default Page;
