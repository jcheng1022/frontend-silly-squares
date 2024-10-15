'use client';

import React from 'react';
import {useRouter} from "next/navigation";

const LobbyList = ({rooms}) => {

    const router = useRouter();
    const columns = [
        {
            title: 'Game Room Name',
            key: 'name',
            render: (game) => <a>{game?.name}</a>,
        },
        {
            title: 'owner',
            key: 'owner',
            render: (game) => <a>{game?.owner?.name}</a>,

        }]
    const childClassName = ` bg-inherit`

    const handleRoomSelection = (room) => () => {
        // if (room?.hasPassword) {
        //     console.log('Room has password')
        // } else {
            router.push(`/game/${room?.id}`)
        // }
    }
    return (
        <div className={'flex flex-col'}>

            {rooms?.map((room) => {
                return (
                    <div key={`room-${room?.id}`} onClick={handleRoomSelection(room)} className={' cursor-pointer flex justify-between bg-slate-100 hover:bg-slate-200  px-4 py-2  w-full '}>
                        <div className="flex flex-col bg-inherit ">
                            <div className={`${childClassName} text-black font-medium`}>
                                {room?.name}
                            </div>
                            <div className={`${childClassName} text-slate-400`}>
                                {room?.owner?.name}
                            </div>


                        </div>
                        {/*{room?.hasPassword && (*/}
                        {/*    <FaLock color={'red'} />*/}

                        {/*)}*/}

                    </div>

                )
            })}
            {/*<List*/}

            {/*    // className={'bg-slate-200'}*/}
            {/*    // header={<div className={'bg-slate-200 text-black font-bold text-lg'}> Active Game Rooms</div>}*/}
            {/*    // footer={<div>Footer</div>}*/}
            {/*    // bordered*/}
            {/*    dataSource={rooms}*/}
            {/*    renderItem={(item) => (*/}
            {/*        <div className={'flex flex-col items-start w-full bg-slate-200 text-black'}>*/}
            {/*            /!*<div className={'flex flex-col items-start w-full   '}>*!/*/}
            {/*                <div>*/}
            {/*                    {item?.name}*/}
            {/*                </div>*/}
            {/*                <div> {item?.owner?.name}</div>*/}
            {/*            /!*</div>*!/*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*/>*/}
            {/*<Table className={'text-red-400'} columns={columns} dataSource={rooms} pagination={false} />*/}


        </div>
    );
};

export default LobbyList;
