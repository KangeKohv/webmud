import {useTelnetContext} from "./telnet/telnetContext";
import {MainLogLastMessage} from "./MainLogLastMessage";
import {ConnectionButton} from "./ConnectionButton";

export const Layout = () => {
    const telnet = useTelnetContext();
    return (
        <div>
            <ConnectionButton/>
            <MainLogLastMessage/>
        </div>
    )
}