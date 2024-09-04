'use client'

import axios from 'axios'
import "firebase/auth";
import {auth} from "@/lib/firebase/firebase";

class APIClient {

    constructor() {
        this.api = axios.create({
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.NEXT_PUBLIC_API_BASE_URL
        })

        this.baseApi = axios.create({
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL: process.env.API_BASE_URL
        })

        this.setInterceptors()
    }

    setInterceptors() {
        this.api.interceptors.request.eject(this.requestInterceptor)
        this.api.interceptors.response.eject(this.responseInterceptor)

        this.requestInterceptor = this.api.interceptors.request.use(async (config) => {

            try {
                const user = await auth.currentUser

                if (user) {
                    const idToken = await user.getIdToken();
                    config.headers['Authorization'] = `Bearer ${idToken}`;
                }
            } catch (error) {
                console.error('Error getting ID token:', error);
            }

            return config
        }, (error) => {
            return Promise.reject(error)
        })



        this.responseInterceptor = this.api.interceptors.response.use(
            (response) => {
                return Promise.resolve(response.data?.data ?? response.data);
            },
            (error) => {
                return Promise.reject(error.response?.data?.data || error.response?.data || error.toString());
            }
        );
        this.isReady = true

    }
}

export default new APIClient


