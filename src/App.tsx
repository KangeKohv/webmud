import React from 'react';
import './App.css';
import {TelnetContextProvider} from "./telnet/telnetContext";
import {Layout} from './Layout';

function App() {
    return <TelnetContextProvider>
        <Layout/>
    </TelnetContextProvider>
}

export default App;
