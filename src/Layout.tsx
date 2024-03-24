import {MainLogLastMessage} from "./MainLogLastMessage";
import {ConnectionButton} from "./ConnectionButton";
import {InputPanel} from "./InputPanel";
import React from "react";

export const Layout = () => {
    return (
        <div style={{height: '100%'}} className="flex flex-col">
            <div>
                <ConnectionButton/>
            </div>
            <div className="grow">
                <MainLogLastMessage/>
            </div>
            <div>
                <InputPanel/>
            </div>
        </div>
    )
}