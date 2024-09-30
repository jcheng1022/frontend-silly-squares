'use client'


import {auth} from "@/lib/firebase/firebase";
import {useQuery} from "@tanstack/react-query";
import {defaultQueryProps} from "@/app/providers";
import APIClient from "@/services/api";


export const useGame = (gameId, props = {})  => {

    const queryKey = ['game', gameId, props];



    return useQuery({
        queryKey,
        ...defaultQueryProps,
        enabled: !!gameId,
        retry: 5,
        queryFn: () => APIClient.api.get(`/games/${gameId}`, {params: props})
    })


}

export const useGameReadyStatuses = (playersJoined, gameId, props = {})  => {

    const queryKey = ['game-ready-status', gameId, props];

    const uid = auth.currentUser?.uid


    return useQuery({
        queryKey,
        ...defaultQueryProps,
        enabled: !!playersJoined && !!gameId,
        retry: 5,
        queryFn: () => APIClient.api.get(`/games/${gameId}/ready-status`, {params: props})
    })


}

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




export const useGameRoomPlayers = (userId, gameId, props = {})  => {

    const queryKey = ['game-room-players', gameId, props];



    return useQuery({
        queryKey,
        ...defaultQueryProps,
        enabled: !!userId && !!gameId,
        retry: 5,
        queryFn: () => APIClient.api.get(`/games/${gameId}/players`, {params: props})
    })


}
