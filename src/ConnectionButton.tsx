import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./telnet/useTelnetNew";
import React from "react";

export const ConnectionButton = () => {
    const telnetContext = useTelnetContext();
    const {connect, disconnect} = telnetContext.functions;
    const {status} = telnetContext.data;
    const statusText = status === State.OPEN ? "connected" : "disconnected";

    const toggleConnection = () => {
        if(status === State.OPEN) {
            disconnect();
        } else {
            connect();
        }
    }

    return (
        <button className="btn btn-blue" onClick={toggleConnection}>Currently {statusText}</button>
    )
}