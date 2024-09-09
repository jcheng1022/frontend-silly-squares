'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/context/AuthContext";
import {useCurrentUser} from "@/hooks/user.hooks";

const Hero = () => {
    const router = useRouter()
    const { handleSignIn} = useAuthContext()
    const {data: user, isLoading} = useCurrentUser()

    const handleCta = () => {
        if (isLoading) return;

        if (!!user) {
            router.push('/generate')
        } else {
            handleSignIn()
        }
    }
    return (
        <div className={'py-12 text-center'}>

            <div className={'mb-6'}>
                <div className={' text-2xl sm:text-6xl font-bold'}> Code Tests Generator</div>
                <div className={'text-2xl text-slate-400'}> No more untested code </div>
            </div>
            <button onClick={handleCta} className={' text-2xl font-bold rounded-xl bg-orange-400 px-8 py-4'}> Get Started</button>


        </div>
    );
};

export default Hero;
