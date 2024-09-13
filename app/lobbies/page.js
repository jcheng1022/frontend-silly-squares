import React from 'react';
import ActiveLobby from "@/components/lobby/ActiveLobby";

const Page = () => {
    return (
        <div className={`m-4 lg:m-12`}>
            <div className={'flex justify-center text-center text-4xl font-semibold'}>
                Active Lobbies
            </div>

            <ActiveLobby />
        </div>
    );
};

export default Page;
