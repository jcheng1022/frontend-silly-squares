'use client'


import {auth} from "@/lib/firebase/firebase";
import {useQuery} from "@tanstack/react-query";
import {defaultQueryProps} from "@/app/providers";
import APIClient from "@/services/api";

export const useLobbyRooms = (userId, props = {})  => {

    const queryKey = ['lobby', 'rooms', props];

    const uid = auth.currentUser?.uid


    return useQuery({
        queryKey,
        ...defaultQueryProps,
        enabled: !!userId,
        retry: 5,
        queryFn: () => APIClient.api.get(`/games/lobbies`, {params: props})
    })


}
