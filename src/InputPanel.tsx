import {useTelnetContext} from "./telnet/telnetContext";
import React, {useState} from "react";

export const InputPanel = () => {
    const {send} = useTelnetContext().functions;
    const [text, setText] = useState("")

    const onInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("onInput", e.key);
        if(e.key === "Enter") {
            e.preventDefault();
            send(text);
            console.log("Sent ", text);
            setText("");
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        console.log("onChange, set", e.target.value);
    }

    return <textarea className="h-full w-full border-2" value={text} onKeyDown={onInput} onChange={onChange}/>
}