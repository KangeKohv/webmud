import {useTelnetContext} from "./telnet/telnetContext";
import React, {useState} from "react";

export const InputPanel = () => {
    const {send} = useTelnetContext().functions;
    const [text, setText] = useState("")

    const onInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter") {
            e.preventDefault();
            send(text);
            setText("");
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    return <textarea className="h-full w-full border-2" value={text} onKeyDown={onInput} onChange={onChange}/>
}