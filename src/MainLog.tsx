import {FC, useEffect, useMemo, useState} from "react";

const MAX_LENGTH = 30;

export const MainLog: FC<MainLogProps> = ({addReceiveListener}) => {
    const [windowText, setWindowText] = useState<string[]>([])
    const receiveListener = useMemo(() => (text: string) => {
        console.log("Received text from hook inside MainLog", text);
        const newArr = [...windowText, text];
        console.log('Existing arr', windowText);
        console.log('NewArr', newArr);
        if(newArr.length > MAX_LENGTH) {
            console.log("Arr too long, truncating");
            newArr.shift();
        }
        console.log(newArr);
        setWindowText(newArr);
    }, [windowText, setWindowText]);


    useEffect(() => {
        addReceiveListener(receiveListener);
    }, [receiveListener, addReceiveListener]);

    return <textarea disabled value={windowText.join('\n')}/>
}

interface MainLogProps {
    addReceiveListener: any
}