import React, {useEffect, useState} from "react";
import {useTelnetContext} from "./telnet/telnetContext";

const MAX_LENGTH = 4;

export const MainLogLastMessage = () => {
    const {lastTextMessage} = useTelnetContext().data;
    const [windowText, setWindowText] = useState<string[]>([])

    useEffect(() => {
        const newText = [...windowText];
        if (newText.length > MAX_LENGTH) {
            newText.shift();
        }
        console.log("rec in mainlog", lastTextMessage);
        newText.push(lastTextMessage);
        setWindowText(newText);
    }, [lastTextMessage]);

    return <textarea className="h-full w-full border-2" disabled value={windowText.join('\n')}/>
}
