import React, {useEffect, useMemo} from 'react';
import './App.css';
import { MainLog } from './MainLog';
import {State, useTelnetNew} from "./useTelnetNew";

function App() {

    const {status, disconnect, connect, send, addReceiveListener} = useTelnetNew();
    let stateMessage: string;
    switch(status) {
        case State.CLOSED:
            stateMessage = "closed";
            break;
        case State.CLOSING:
            stateMessage = "closing";
            break;
        case State.OPEN:
            stateMessage = "connected";
            break;
        case State.CONNECTING:
            stateMessage = "connecting";
            break;
    }

    const action = status === State.OPEN ? () => disconnect() : () => connect();
    const actionText = status === State.OPEN ? "disconnect" : "connect";
    //
    // const receiveListener = useMemo(() => (text: string) => {
    //     console.log("Received text from hook", text);
    // }, []);
    //
    // useEffect(() => {
    //     addReceiveListener(receiveListener);
    // }, [receiveListener, addReceiveListener]);

    const doSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter") {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement
            const text = target.value + "\n";
            send(text);
            target.value = '';
        }
    }

  return (
      <div>
          <p>Hello World</p>
          <MainLog addReceiveListener={addReceiveListener}/>
          <button onClick = {() => action()}>{actionText}</button>
          <textarea onKeyDown={doSend}/>
      </div>
  );
}

export default App;
