import React, {useEffect, useState} from 'react';
import {Input, Modal} from "antd";
import {useGameContext} from "@/context/GameContext";

const GameStartingModal = ({open = false}) => {
    const [countdown, setCountdown]= useState(5)
    const {channel } = useGameContext()

    useEffect(() => {

        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }

        if (countdown === 0 ) {
            //handle game start
            console.log(`game starting`)
            channel.publish("game-start",  {})

        }
    }, [countdown]);

    return (
        <Modal open={open} closable={false} closeIcon={null} footer={[]}  >

            <div> The Game is starting!</div>

            <div> {countdown}</div>
        </Modal>
    );
};

export default GameStartingModal;
