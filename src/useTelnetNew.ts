import {useEffect, useMemo, useState} from "react";

let ws: undefined | WebSocket;

export enum State {
    CLOSED,
    CLOSING,
    CONNECTING,
    OPEN
}

enum Options {
    Echo = 1,
    SuppressGoAhead = 3,
    Status = 5,
    TimingMark = 6,
    TerminalType = 24,
    WindowSize = 31,
    TerminalSpeed = 32,
    RemoteFlowControl = 33,
    LineMode = 34,
    EnvironmentVariables = 36,
    NewEnvironment = 39,
    MSDP = 69,
    MSSP = 70,
    MCCP1 = 85,
    MCCP2 = 86,
    MSP = 90,
    MXP = 91,
    ZMP = 93,
    ATCP = 200,
    GMCP = 201,
    WILL = 251,
    WONT = 252,
    DO = 253,
    DONT = 254,
    IAC = 255
}

const OptionsTexts: { [key: number]: string } = {
    [Options.Echo]: "ECHO",
    [Options.SuppressGoAhead]: "SuppressGoAhead",
    [Options.Status]: "Status",
    [Options.TimingMark]: "TimingMark",
    [Options.TerminalType]: "TerminalType",
    [Options.WindowSize]: "WindowSize",
    [Options.TerminalSpeed]: "TerminalSpeed",
    [Options.RemoteFlowControl]: "RemoteFlowControl",
    [Options.LineMode]: "LineMode",
    [Options.EnvironmentVariables]: "EnvironmentVariables",
    [Options.NewEnvironment]: "NewEnvironment",
    [Options.MSDP]: "MSDP",
    [Options.MSSP]: "MSSP",
    [Options.MCCP1]: "MCCP1",
    [Options.MCCP2]: "MCCP2",
    [Options.MSP]: "MSP",
    [Options.MXP]: "MXP",
    [Options.ZMP]: "ZMP",
    [Options.ATCP]: "ATCP",
    [Options.GMCP]: "GMCP",
    [Options.WILL]: "WILL",
    [Options.WONT]: "WONT",
    [Options.DONT]: "DONT",
    [Options.DO]: "DO"
}

export const useTelnetNew = () => {

    const [status, setStatus] = useState<State>(State.CLOSED);
    const [lastMessage, setLastMessage] = useState<Uint8Array>();
    const [lastTextMessage, setLastTextMessage] = useState("");

    const connect = () => {
        updateStatus(State.CONNECTING);
        ws = new WebSocket('wss://discworld.starturtle.net:4244');
        // ws = new WebSocket('wss://javascript.info/article/websocket/chat/ws');
        ws.addEventListener("open", () => {
            updateStatus(State.OPEN);
            if (ws?.binaryType === "blob") {
                ws.binaryType = "arraybuffer";
            }
        });
        ws.addEventListener("close", () => {
            updateStatus(State.CLOSED);
        });
        ws.addEventListener("message", (event) => {
            receive(event.data);
        });
    }

    const receive = (data: ArrayBuffer) => {
        const arr = new Uint8Array(data);
        const [head, ...rest] = arr;
        if (head === Options.IAC) {
            console.log("Received IAC", rest.map(byte => OptionsTexts[byte] ?? byte).join(" "));
            // if (rest[0] === Options.DO) {
            //     if (rest[1] === Options.TerminalType) {
            //         sendIAC([Options.WILL, Options.TerminalType]);
            //     }
            // }
            // if (rest[0] === Options.WILL && rest[1] === Options.GMCP) {
            //     console.log("WILL GMCP");
            //     sendIAC([Options.IAC, Options.DO, Options.GMCP])
            // }
            // if (rest[0] === Options.DO && rest[1] === Options.MCCP2) {
            //     console.log("DO MCCP2");
            //     ws?.send(`${Options.IAC}${Options.WILL}${Options.MCCP2}`);
            // }
        } else {
            const text = new TextDecoder().decode(arr);
            setLastTextMessage(text);
        }
        setLastMessage(arr);
    };

    // const sendIAC = (sequence: number[]) => {
    //     const arr = new Uint8Array(sequence);
    //     ws?.send(arr);
    // }

    const disconnect = () => {
        updateStatus(State.CLOSING);
        ws?.close();
    }

    const send = useMemo(() => (text: string) => {
        console.log("sending (ws) (text) (length)", ws, `(${text})`, text.length);
        ws?.send(text + "\r\n");
    }, []);

    const updateStatus = (state: State) => {
        setStatus(state);
    }

    useEffect(() => {
        if (!ws) {
            setStatus(State.CLOSED);
        }
    }, [ws]);

    return {
        functions: {
            connect,
            disconnect,
            send
        },
        data: {
            status,
            lastMessage,
            lastTextMessage,
        }
    }
}

