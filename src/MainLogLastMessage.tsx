import React, {useEffect, useState} from "react";
import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./telnet/useTelnetNew";

const MAX_LENGTH = 2;

export const MainLogLastMessage = () => {
    const {lastTextMessage, status} = useTelnetContext().data;
    const [windowText, setWindowText] = useState<string[]>([]);

    function addMessage(text: string) {
        const newText = [...windowText];
        if (newText.length > MAX_LENGTH) {
            newText.shift();
        }
        newText.push(text);
        setWindowText(newText);
    }

    useEffect(() => {
        if (status === State.CLOSED && windowText.length) {
            addMessage("!!!Connection Closed!!!");
        }
    }, [status]);

    useEffect(() => {
        addMessage(lastTextMessage);
    }, [lastTextMessage]);

    return <textarea className="h-full w-full border-2" disabled value={windowText.join('\n')}/>
}
