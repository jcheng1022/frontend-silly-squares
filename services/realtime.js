'use client'

// import {Realtime} from "ably";
//
// export const realtimeClient = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });


// realtimeClient.ts
import {Realtime} from 'ably';


let realtimeClient;

// Function to get the instance of Realtime client
export const getRealtimeClient = () => {
    if (!realtimeClient) {
        console.log(`Creating new Realtime client`)
        realtimeClient = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    }
    console.log(`a realtime client exists, using existing client`)

    return realtimeClient;
};
