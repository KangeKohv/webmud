import {useEffect, useState} from "react";
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
        newText.push(lastTextMessage);
        setWindowText(newText);
    }, [lastTextMessage]);

    return <textarea disabled value={windowText.join('\n')}/>
}
