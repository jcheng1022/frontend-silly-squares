'use client';
import React from 'react';
import {Button, Dropdown} from "antd";
import {useAuthContext} from "@/context/AuthContext";
import {useCurrentUser, useUserIsLoggedIn} from "@/hooks/user.hooks";
import {useRouter} from "next/navigation";


const Header = () => {
    const router = useRouter()

    const { data: user, isFetching, isLoading,  } = useCurrentUser();
    const fetchingUser = isFetching || isLoading;

    const userUid = useUserIsLoggedIn()

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    2nd menu item (disabled)
                </a>
            ),
            // icon: <SmileOutlined />,
            disabled: true,
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item (disabled)
                </a>
            ),
            disabled: true,
        },
        {
            key: '4',
            danger: true,
            label: 'a danger item',
        },
    ];



    const {logOut, handleSignIn } = useAuthContext()

    const endSection = () => {
        console.log(userUid)
        if (userUid && !user && fetchingUser) {
            return <div>Loading...</div>
        }
        if (!userUid && !user) {
            return (
                <Button className={'bg-sky-300 text-white font-bold h-10 px-4'} onClick={() => handleSignIn()}>
                    Get Started
                </Button>
            )
        }
        if (userUid && user && !fetchingUser) {

            return (
                <Dropdown
                    menu={{
                        items,
                    }}
                    trigger={["click"]}
                >
                    <div className={' text-md sm:text-2xl  cursor-pointer font-bold hover:text-orange-500'} onClick={() => router.push(`/user/${user?.firebaseUuid}`)}  > {user?.name ? user.name : 'No name yet!'} </div>
                </Dropdown>

            )
        }
    }



    return (
        <div className={'px-8 h-24 py-4 flex  items-center justify-between bg-neutral-800 text-white'}>
            <div className={'font-bold text-lg sm:text-3xl cursor-pointer hover:text-orange-500'}>
                Code Tests Generator
            </div>
            <div>
                {endSection()}
            </div>
        </div>
    );
};

export default Header;
