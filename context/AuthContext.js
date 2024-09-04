'use client'

import {createContext, useContext, useState} from "react";
import {auth} from "@/lib/firebase/firebase";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useQueryClient} from "@tanstack/react-query";

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);


export const AuthContextProvider = ({
                                        children,
                                    }) => {


    const [loading, setLoading] = useState(true);
    const client = useQueryClient();


    const logOut = async () => {
        await auth.signOut()
        if (window) {
            return window.location.href = window.location.href

        }

    }

    const handleSignIn =  async ()=> {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then( (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // window.location.href = window.location.href

            }).catch((error) => {
            console.log(`Error signing in: ${error}`)
            // Handle Errors here.

        })
    }

    const settings = {
        handleSignIn,
        logOut,
        initializingAuth: loading
    }




    return (
        <AuthContext.Provider value={settings}>

            {children}

        </AuthContext.Provider>
    );
};
