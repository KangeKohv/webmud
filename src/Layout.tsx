import {MainLogLastMessage} from "./MainLogLastMessage";
import {ConnectionButton} from "./ConnectionButton";
import {InputPanel} from "./InputPanel";
import React from "react";
import {LogWindow} from "./LogWindow";

export const Layout = () => {
    return (
        <div className="flex flex-col h-screen max-h-[99vh]">
            <div>
                <ConnectionButton/>
            </div>
            <LogWindow/>
            <div>
                <InputPanel/>
            </div>
        </div>
    )
}