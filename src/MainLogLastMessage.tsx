import Anser from "anser";
import React, {useEffect, useRef, useState} from "react";
import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./telnet/useTelnetNew";

const MAX_LINES = 200;

export const MainLogLastMessage = () => {
    const textArea:  React.LegacyRef<HTMLTextAreaElement> = useRef(null);
    const {lastTextMessage, status} = useTelnetContext().data;
    const [logElements, setLogElements] = useState<LogElement[]>([]);

    function addMessage(text: string) {
        const ansedText = Anser.ansiToJson(text).filter(parsed => !parsed.isEmpty());
        const parsedText = ansedText.map(t => t.content).join('');
        const lines = parsedText.split("\r\n");
        const newLogElements = logElements.length ? [...logElements] : [{type: LogElementType.STRING, content: ""}];
        newLogElements[newLogElements.length - 1].content += lines[0];
        lines.shift();
        const newLines = [...newLogElements, ...lines.map(line => ({type: LogElementType.STRING, content: line}))];
        const slicedLines = newLines.slice(Math.max(0, newLines.length - MAX_LINES));
        setLogElements(slicedLines);
    }

    useEffect(() => {
        if (status === State.CLOSED && logElements.length) {
            addMessage("!!!Connection Closed!!!");
        }
    }, [status]);

    useEffect(() => {
        addMessage(lastTextMessage);
    }, [lastTextMessage]);

    useEffect(() => {
        const area = textArea.current;
        if (!area) return;
        area.scrollTop = area.scrollHeight;
    });

    return <textarea ref={textArea} className="h-full w-full border-2 font-mono" disabled value={logElements.map(el => el.content).join('\n')}/>
}

interface LogElement {
    type: LogElementType;
    content: string;
}

enum LogElementType {
    STRING
}