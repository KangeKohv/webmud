import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import useWebSocket, {ReadyState} from "react-use-websocket";

const IAC = 255;

const TELNET_LOOKUP: {[key: number]: string} = {
    255: "IAC ",
    251: "WILL",
    252: "WONT",
    253: "DO  ",
    254: "DONT"
}

function App() {

    const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
    const [messageHistory, setMessageHistory] = useState<any[]>([]);

    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl);
    const ws = getWebSocket();
    if (ws) {
        if ("binaryType" in ws) {
            ws.binaryType = 'arraybuffer';
        }
    }

    useEffect(() => {
        if (lastMessage !== null) {
            // console.log(lastMessage);
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
    }, [lastMessage, setMessageHistory]);

    const handleClickChangeSocketUrl = useCallback(
        () => setSocketUrl('wss://discworld.starturtle.net:4244'),
        []
    );

    const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <button onClick={handleClickChangeSocketUrl}>
                Click Me to change Socket Url
            </button>
            <button
                onClick={handleClickSendMessage}
                disabled={readyState !== ReadyState.OPEN}
            >
                Click Me to send 'Hello'
            </button>
            <span>The WebSocket is currently {connectionStatus}</span>
            {/*{lastMessage ? <span>Last message: {lastMessage.data}</span> : null}*/}
            <ul>
                {messageHistory.map((message, idx) => (
                    <span key={idx}>{message ? message.data : null}</span>
                ))}
            </ul>
        </div>
    );
}

export default App;
