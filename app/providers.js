'use client'


import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
// import { AblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';


export const defaultQueryProps = {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60000
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    })
}

let browserQueryClient = undefined

function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient()
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}
// const client = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });

export default function Providers({ children }) {

    const queryClient = getQueryClient()


    return (
        <QueryClientProvider client={queryClient}>
            {/*<AblyProvider client={client}>*/}
            {/*    <ChannelProvider channelName="get-started">*/}
                    {children}
            {/*    </ChannelProvider>*/}
            {/*</AblyProvider>*/}
        </QueryClientProvider>
    )
}
