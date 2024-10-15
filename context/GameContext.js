'use client'

import {createContext, useContext} from "react";

export const GameContext = createContext({});

export const useGameContext = () => useContext(GameContext);


export const GameContextProvider = ({
                                        children,
                                    }) => {

    const settings = {

    }




    return (
        <GameContext.Provider value={settings}>

            {children}


            {/*<GameStartingModal open={gameIsStarting} />*/}

        </GameContext.Provider>
    );
};
