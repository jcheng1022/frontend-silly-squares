'use client'

import React, {useState} from 'react';
import {useLobbyRooms} from "@/hooks/games.hooks";
import LobbyList from "@/components/lobby/LobbyList";
import {useCurrentUser} from "@/hooks/user.hooks";
import CreateGameModal from "@/components/modals/CreateGameModal";

const ActiveLobby = () => {

    const {data: user} = useCurrentUser()
    const {data: rooms} = useLobbyRooms(user?.id)
    const [creating, setCreating] = useState(false)

    return (
        <>
            <div
                onClick={() => setCreating(true)}
                className={'cursor-pointer hover:underline text-center text-lg text-sky-300 mb-4'}> Create a room</div>
            <LobbyList rooms={rooms} />

            {/*{!!creating && (*/}
                <CreateGameModal open={creating} setOpen={setCreating}/>
            {/*)}*/}
        </>
    );
};

export default ActiveLobby;
