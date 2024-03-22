import useWebSocket, {ReadyState} from "react-use-websocket";
import {useEffect, useState} from "react";

const IAC = 255;

const TELNET_LOOKUP: {[key: number]: string} = {
    255: "IAC ",
    251: "WILL",
    252: "WONT",
    253: "DO  ",
    254: "DONT"
}

export const useTelnet = () => {
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket('wss://discworld.starturtle.net:4244');
    const ws = getWebSocket() as WebSocket;
    if (ws) {
        if ("binaryType" in ws) {
            ws.binaryType = 'arraybuffer';
        }
    }

    const [isConnected, setConnected] = useState(readyState === ReadyState.OPEN);


    ws.onclose = () => {
        setConnected(false);
    }

    const disconnect = ()=> {
        ws.close();
    };

    useEffect(() => {
        setConnected(readyState === ReadyState.OPEN);
    }, [readyState])

    useEffect(() => {
        if (lastMessage !== null) {
            if (lastMessage.data && lastMessage.data instanceof ArrayBuffer) {
                const data = lastMessage.data;
                const dataView = new DataView(data);
                const firstCharacter = dataView.getUint8(0);
                if (firstCharacter === IAC) {
                    const command = new Uint8Array(data);
                    let commandString = "";
                    for (let i = 1; i < command.length; i++) {
                        const charac = command[i];
                        if (TELNET_LOOKUP[charac]) {
                            commandString += TELNET_LOOKUP[charac];
                        } else {
                            commandString += charac;
                        }
                        commandString += " ";
                    }
                    console.log("SUBNEGOTIATE: ", commandString);
                } else {
                    console.log(new TextDecoder().decode(lastMessage.data));
                }
            } else {
                console.log("Don't know what it is: ", lastMessage.data);
            }
            // setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    return {
        isConnected,
        disconnect
    }
}