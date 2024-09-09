'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import {useAuthContext} from "@/context/AuthContext";

const Hero = () => {
    const router = useRouter()
    const { handleSignIn} = useAuthContext()
    return (
        <div className={'py-12 text-center'}>

            <div className={'mb-6'}>
                <div className={' text-2xl sm:text-6xl font-bold'}> Code Tests Generator</div>
                <div className={'text-2xl text-slate-400'}> No more untested code </div>
            </div>
            <button onClick={() => handleSignIn()} className={' text-2xl font-bold rounded-xl bg-orange-400 px-8 py-4'}> Get Started</button>


        </div>
    );
};

export default Hero;
