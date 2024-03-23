import {useTelnetContext} from "./telnet/telnetContext";
import {State} from "./useTelnetNew";

export const ConnectionButton = () => {
    const telnetContext = useTelnetContext();
    const {connect, disconnect} = telnetContext.functions;
    const {status} = telnetContext.data;

    const toggleConnection = () => {
        if(status == State.OPEN) {
            disconnect();
        } else {
            connect();
        }
    }

    return (
        <button onClick={toggleConnection}>Currently {status}</button>
    )
}