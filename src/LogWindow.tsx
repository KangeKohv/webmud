import Anser from "anser";
import React, {useEffect, useRef, useState} from "react";
import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./telnet/useTelnetNew";
import Ansi from "./Ansi";

const MAX_LINES = 200;

export const LogWindow = () => {
    const textArea:  React.LegacyRef<HTMLDivElement> = useRef(null);
    const {lastTextMessage, status} = useTelnetContext().data;
    const [lines, setLines] = useState<string[]>([]);

    function addMessage(instext: string) {
        const text = instext.replace(/ /g, '\u00a0');
        console.log("replaced", text);
        const oldLines = lines.length ? [...lines] : [""];
        const newLines = text.split("\r\n");
        oldLines[oldLines.length - 1] += newLines[0];
        newLines.shift();
        const replaceLines = [...oldLines, ...newLines];
        const slicedLines = replaceLines.slice(Math.max(0, replaceLines.length - MAX_LINES));
        setLines(slicedLines);
    }

    useEffect(() => {
        if (status === State.CLOSED && lines.length) {
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

    return <div className="overflow-auto text-white bg-black h-full" ref={textArea}>{lines.map(line => (<><Ansi>{line}</Ansi><br/></>))}</div>
}
