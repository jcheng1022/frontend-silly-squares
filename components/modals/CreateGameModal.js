'use client';

import React, {useState} from 'react';
import {Input, Modal, notification} from "antd";
import APIClient from "@/services/api";
import {useQueryClient} from "@tanstack/react-query";

const CreateGameModal = ({open, setOpen}) => {
    const [form, setForm] = useState({
        name: ""
    })
    const client = useQueryClient();

    const [api, contextHolder] = notification.useNotification();
    const [errors, setErrors] = useState({

    })

    const handleChange = (name) => async (e) => {
        setForm((prev) => {
            return {
                ...prev,
                [name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {

        // validate

        if (!form?.name) {

            setErrors((prev) => {
                return {
                    ...prev,
                    name: 'Name is required'
                }
            })
        }

        if (form.name.length < 3) {
            setErrors((prev) => {
                return {
                    ...prev,
                    name: 'Name must be at least 3 characters'
                }
            })
        }

        if (form.name.length > 12) {
            setErrors((prev) => {
                return {
                    ...prev,
                    name: 'Name cannot be more than 12 characters'
                }
            })
        }


        await APIClient.api.post(`/games`, form).then(async () => {
            await client.refetchQueries({
                queryKey: ['lobby', 'rooms', {}]
            })

            setOpen(false)

        }).catch((e) => {
            api.open({
                type: "error",
                message: "Error creating room",
                description: e?.message ?? "Something went wrong"
            })
        })


    }
    return (
        <Modal open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} >
            {contextHolder}
            <div className={'text-xl font-semibold'}> Create a Room</div>

            <div className={'h-8'}/>

            <div> Room Name</div>

            <Input value={form?.name} onChange={handleChange('name')} placeholder={'Silliest of Squares'} />
            {errors?.name && (<div className={'text-sm text-red-500'}> {errors?.name}</div>)}
            <div className={'h-2'}/>


            <div>
                Password(optional)
            </div>
            <Input placeholder={'Password'} type={'password'} />

            <div className={'h-4'}/>

            <div className={'text-center text-slate-400'}> {`You will automatically be assigned as player one at time of creation.`}</div>


        </Modal>
    );
};

export default CreateGameModal;
