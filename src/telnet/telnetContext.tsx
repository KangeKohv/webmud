import React, {useContext} from "react";
import {State, useTelnetNew} from "./useTelnetNew";

const TelnetContext = React.createContext({
    functions: {
        connect: () => {},
        disconnect: () => {},
        send: (arg0: string) => {},
    },
    data: {
        lastTextMessage: "",
        status: State.CLOSED,
    }
});

export const TelnetContextProvider = ({children}: any) => {
    const telnet = useTelnetNew();
    return (
        <TelnetContext.Provider value={telnet}>{children}</TelnetContext.Provider>
    );
};

export const useTelnetContext = () => {
    return useContext(TelnetContext);
};