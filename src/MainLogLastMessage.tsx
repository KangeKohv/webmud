import Anser from "anser";
import React, {useEffect, useState} from "react";
import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./telnet/useTelnetNew";

const MAX_LENGTH = 7;

export const MainLogLastMessage = () => {
    const {lastTextMessage, status} = useTelnetContext().data;
    const [windowText, setWindowText] = useState<string[]>([]);

    function addMessage(text: string) {
        const ansedText = Anser.ansiToJson(text).filter(parsed => !parsed.isEmpty());
        const parsedText = ansedText.map(t => t.content).join('');
        console.log(parsedText);
        const newText = [...windowText];
        if (newText.length > MAX_LENGTH) {
            newText.shift();
        }
        newText.push(parsedText);
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
