'use client';
import React from 'react';
import {Dropdown} from "antd";
import {useAuthContext} from "@/context/AuthContext";
import {useCurrentUser, useUserIsLoggedIn} from "@/hooks/user.hooks";
import {useRouter} from "next/navigation";


const Header = () => {
    const router = useRouter()

    const { data: user, isFetching, isLoading,isRefetching  } = useCurrentUser();
    const fetchingUser = isFetching || isLoading;

    const userUid = useUserIsLoggedIn()


    const {logOut, handleSignIn } = useAuthContext()

    const items = [
        // {
        //     key: '1',
        //     label: (
        //         <div onClick={() => router.push(`/user/${user?.firebaseUuid}`)}>
        //             My Profile
        //         </div>
        //     ),
        // },

        {
            key: '4',
            danger: true,
            label: 'Log Out',
            onClick: () => logOut()
        },
    ];


    const endSection = () => {

        if (!userUid && !user && !fetchingUser && !isRefetching) {
            return (
                <button className={' rounded-xl font-bold h-10 px-4'} onClick={() => handleSignIn()}>
                    <span className={'text-white hover:text-orange-400 '} >Log In / Sign Up</span>
                </button>
            )
        }
        if (userUid && user && !fetchingUser) {

            return (
               <div className={'flex items-center'}>
                   <Dropdown
                       menu={{
                           items,
                       }}
                       trigger={["click"]}
                   >
                       <div className={' text-md sm:text-2xl  cursor-pointer font-bold hover:text-orange-500'}   > {user?.name ? user.name : 'No name yet!'} </div>
                   </Dropdown>
               </div>

            )
        }
    }



    return (
        <div className={'px-8 h-24 py-4 flex  items-center justify-between bg-neutral-800 text-white'}>
            <div className={'font-bold text-lg sm:text-3xl cursor-pointer hover:text-orange-500'} onClick={() => router.push('/')}>
                Silly Squares
            </div>
            <div>
                {endSection()}
            </div>
        </div>
    );
};

export default Header;
