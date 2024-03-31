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
    // const [lastTextMessage, setLastTextMessage] = useState(
    //   "LPmud version : DW OS v1.01 on port 4243.\r\n" +
    //   "Welcome to Discworld: the stuff of which dreams are made.\r\n" +
    //   "\r\n" +
    //   "Silently, slowly and surely, Great A'Tuin paddles through space, its\r\n" +
    //   "great eyes surveying the dark, empty wastes before and behind it.\r\n" +
    //   "Standing on A'Tuin's great back are four enormous elephants, straining\r\n" +
    //   "under the colossal weight of the Discworld itself.  It sparkles with\r\n" +
    //   "magic, reflects the light of the stars and generally fails to be as\r\n" +
    //   "unobtrusive as possible.\r\n" +
    //   "\r\n" +
    //   "A large, floppy, black hat recedes into the distance, somehow looking\r\n" +
    //   "satisfied at what it has left behind.\r\n" +
    //   "\r\n" +
    //   "Q - Quit\r\n" +
    //   "M - Print this menu again\r\n" +
    //   "D - Delete your character\r\n" +
    //   "R - Request a temporary password\r\n" +
    //   "U - Short list of who is on-line\r\n" +
    //   "L - Short list of liaisons on-line\r\n" +
    //   "P - Uptime\r\n" +
    //   "F - Finger someone\r\n" +
    //   "N - New character\r\n" +
    //   "G - Guest character\r\n" +
    //   "\r\n" +
    //   "Or, enter your current character's name\r\n" +
    //   "\r\n" +
    //   "Your choice: g\r\n" +
    //   "\r\n" +
    //   "\r\n" +
    //   "\r\n" +
    //   "\r\n" +
    //   "Welcome to Discworld: the mud that launched a thousand telnets, a mud based\r\n" +
    //   "on the Discworld books by Terry Pratchett.\r\n" +
    //   "\r\n" +
    //   "If you are in trouble, talk to a member of the liaison domain\r\n" +
    //   "or any other creator who is on.  Liaison members can be identified\r\n" +
    //   "with the command 'liaisons', other creators with the command 'finger'.\r\n" +
    //   "\r\n" +
    //   "May the butterflies of your mind never obscure the truth.\r\n" +
    //   "\r\n" +
    //   "Enter the name you wish to use: \r\n" +
    //   "SembolTest\r\n" +
    //   "\r\n" +
    //   "How would you like your name capitalised? [Semboltest] SembolTest\r\n" +
    //   "Should your character be male or female? \r\n" +
    //   "male\r\n" +
    //   "Are you using a screenreader? [yes/no/help] \r\n" +
    //   "no\r\n" +
    //   "\r\n" +
    //   "\r\n" +
    //   "To play on Discworld you must agree to the following terms and conditions:\r\n" +
    //   "\r\n" +
    //   "  * Profanity is not allowed on public channels.\r\n" +
    //   "\r\n" +
    //   "  * Harassment of any kind (including sexual and racial) is grounds for\r\n" +
    //   "    immediate banishment.\r\n" +
    //   "\r\n" +
    //   "  * Use of robot scripts or triggers is not permitted.\r\n" +
    //   "\r\n" +
    //   "  * You may not have more than one character logged in at once.\r\n" +
    //   "\r\n" +
    //   "  * Bugs must be reported; abuse of bugs is often grounds for banishment.\r\n" +
    //   "\r\n" +
    //   "  * Giving out quest spoilers in public is not permitted.\r\n" +
    //   "\r\n" +
    //   "  * It is your responsibility to read, understand and adhere to the rules as\r\n" +
    //   "    given in \"help rules\".\r\n" +
    //   "\r\n" +
    //   "Please read the terms and conditions CAREFULLY! (You have time, we'll be back\r\n" +
    //   "in 30 seconds)\r\n" +
    //   "\r\n" +
    //   "Enter 'yes' if you agree to the terms or 'no' if you cannot.\r\n" +
    //   "By typing 'yes' you signify that you have read, understand and agree to be\r\n" +
    //   "bound by these terms and conditions: [yes/no]\r\n" +
    //   "yes\r\n" +
    //   "\r\n" +
    //   "You have never logged in before.\r\n" +
    //   "Saving...\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Saving...\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     **************************************************************\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     * It is your responsibility to know and adhere to the rules. *\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     * If you are not sure what they are read 'help rules'.       *\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     * Ignorance of the rules will not be accepted as a defence.  *\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     **************************************************************\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[39;49m\u001b[0;10m\r\n" +
    //   "> Queued command: look\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[1mPlease set your finger information with \"chfn\".\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[36mInventory regeneration complete.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "   \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mThis is the main bar of Ankh-Morpork's most infamous pub, the\u001b[39;49m\u001b[0;10m\r\n" +
    //   "   \u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[1;33m@\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mMended Drum.  The bar itself runs along the northeast of the room,\u001b[39;49m\u001b[0;10m\r\n" +
    //   "    \u001b[39;49m\u001b[0;10m\\|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10meast of which lie tier after tier of shelves, all full of exotic,\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mpossibly toxic drinks.  Pools of unpleasant liquid cover quite a\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mlarge part of the floor here, along with a scattering of unpleasant\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            rubbish.  Dotted around this area are several grubby tables and\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            chairs, while a rather tattered menu hangs above the bar.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            The atmosphere in the bar is loud with talk and thick with heavy\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            coils of smoke.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            \u001b[32mThere are four obvious exits: up, north, south and west.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            Hibiscus Dunelm is standing at the bar and a helpful street urchin\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            is standing here.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            A peanut tray full of brochures is on the bar, a dart board is\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            mounted on a wall, The Green Slab box and an AM Daily box are\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            beside the bar and an open colourful brochure is on the floor.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "s\r\n" +
    //   "   \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mThis is the entrance area of the Mended Drum.  There is a small\u001b[39;49m\u001b[0;10m\r\n" +
    //   "   \u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[32m&\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mstaircase here which leads upwards from the Drum's floor to the\u001b[39;49m\u001b[0;10m\r\n" +
    //   "    \u001b[39;49m\u001b[0;10m\\|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mcomparatively clean streets of Ankh-Morpork.  There are a few\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[1;33m@\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mtables around this section of the Drum, each with a damaged chair\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mor two, providing something to eat and drink off.  The Drum is, as\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            always, quite busy; many of the Drum's regulars are lolling at\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            tables around the bar.  Across the room, on the northern side, is\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            the bar where the customers' drinks are supplied.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            The atmosphere in the bar is loud with talk and thick with heavy\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            coils of smoke.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            \u001b[32mThere are three obvious exits: north, south and northwest.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            Stren Withel, Hrun, the splatter and a drunk patron are standing\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            here.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "> \u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m opens the south door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m arrives from the south.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m closes the south door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "s\r\n" +
    //   "You open the south door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   " \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m   \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m    \u001b[39;49m\u001b[0;10mThis is the street just outside the infamous Mended Drum pub,\u001b[39;49m\u001b[0;10m\r\n" +
    //   " \u001b[39;49m\u001b[0;10m\u001b[32m&\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[1;33m@\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10mdescribed in \"Wellcome to Ankh-Morporke, Citie of One Thousand\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m  \u001b[39;49m\u001b[0;10mSurprises\" as \"a Cheereful Taverne in which the Honest Yeomen of\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mthe Citye may be seen Drinking, Singing and Reciting Poetrye.\" \u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mOddly enough, though, \"Wellcome to Ankh-Morporke\" doesn't mention\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mthe bloodstains on the door, the numerous axe notches, or the\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10mlingering aroma of bad ale.  A nearby sign has been provided\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            outside the Drum to aid the numerous drunken revellers who\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            accumulate during the night, though how effectively is\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            questionable.  A sturdy door leads north into the pub (if you\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            dare), to the south is Short Street and Filigree Street runs\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            east-west.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            The densely packed crowds make it difficult to move, and unpleasant\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            to breathe.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            \u001b[33mIt is a freezing cold spindlewinter's evening with a strong breeze\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            \u001b[33mand some puffy clouds.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            \u001b[33m\u001b[39;49m\u001b[0;10m\u001b[32mThere are four obvious exits: east, west, south and north.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            A paperboy and \u001b[37m\u001b[1mAuric\u001b[39;49m\u001b[0;10m are standing here.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "            A wanted poster is pasted to a wall.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "You close the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "> \u001b[33mThe evening sun peeks out from behind a cloud.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[33m\u001b[39;49m\u001b[0;10m\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m opens the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m arrives from the north.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m closes the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Brut looks around.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "finger brut\r\n" +
    //   "\u001b[1mLogin name: \u001b[39;49m\u001b[0;10mBrut                       \u001b[1mReal name: \u001b[39;49m\u001b[0;10m???\r\n" +
    //   "Member of the priesthood of Pishe      \r\n" +
    //   "First logged on Tue Mar 26 04:42:52 2024.\r\n" +
    //   "12 hours, 19 minutes and 32 seconds old.\r\n" +
    //   "On since Sun Mar 31 10:45:31 2024 (35 minutes and 49 seconds).\r\n" +
    //   "Idle for 10 seconds.\r\n" +
    //   "No mail.\r\n" +
    //   "No project.\r\n" +
    //   "No plan.\r\n" +
    //   "> The paperboy opens the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "The paperboy leaves north.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "The paperboy closes the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "qwho\r\n" +
    //   "\u001b[1m1 Creator:\u001b[39;49m\u001b[0;10m Sojan(\u001b[1m\u001b[31mT\u001b[39;49m\u001b[0;10m)\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[1m2 Playtesters:\u001b[39;49m\u001b[0;10m Mortifi Proeliator\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[1m57 Players:\u001b[39;49m\u001b[0;10m Adassin Adeline Amaranth Arturos Auric Avric Blinkinhek Bonnie Brut\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Buttercup Bybal camas Charon Drygur Ebenezer Egwin Elauna Everest Exalted\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Gznang huFF Humboldt Ishamael Issaru Jeffamere Kensai Kiki Kly Knowshoes\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Lachrymose Lanfear Lyna Matt Mirodar MuRRaY Niecotar Ochrion Ohnoakuga Quow\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Rhath Sauldin Saya SembolTest Sense SkyEye Sleme Stranger StYx Tariq Thican\u001b[39;49m\u001b[0;10m\r\n" +
    //   "Toothpaste Tueur Umiven Wolke Zafrusteria Zaya Zina\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[1m59 Players, 60 Total\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "> glance\r\n" +
    //   " \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m   \u001b[39;49m\u001b[0;10m\u001b[31m+\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m    \u001b[39;49m\u001b[0;10mThe north end of Short Street outside the Mended Drum\u001b[32m [e,w,s,n]\u001b[39;49m\u001b[0;10m.\u001b[39;49m\u001b[0;10m\r\n" +
    //   " \u001b[39;49m\u001b[0;10m\u001b[32m&\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[1;33m@\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m-\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m\u001b[37m\u001b[1mBrut\u001b[39;49m\u001b[0;10m and \u001b[37m\u001b[1mAuric\u001b[39;49m\u001b[0;10m are standing here.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m  \u001b[39;49m\u001b[0;10mA wanted poster is pasted to a wall.\u001b[39;49m\u001b[0;10m\u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[32m$\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m\u001b[36m*\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10m\r\n" +
    //   "     \u001b[39;49m\u001b[0;10m|\u001b[39;49m\u001b[0;10m      \u001b[39;49m\u001b[0;10m\r\n" +
    //   "> A passing witch clears her throat mightily.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mNimble Bybal\u001b[39;49m\u001b[0;10m arrives from the east.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mNimble Bybal\u001b[39;49m\u001b[0;10m leaves south.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mVirtuoso Saya\u001b[39;49m\u001b[0;10m arrives from the east.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mVirtuoso Saya\u001b[39;49m\u001b[0;10m opens the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mVirtuoso Saya\u001b[39;49m\u001b[0;10m leaves north.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mVirtuoso Saya\u001b[39;49m\u001b[0;10m closes the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mAuric\u001b[39;49m\u001b[0;10m opens the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mAuric\u001b[39;49m\u001b[0;10m leaves north.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "\u001b[37m\u001b[1mAuric\u001b[39;49m\u001b[0;10m closes the Mended Drum's sturdy door.\u001b[39;49m\u001b[0;10m\r\n" +
    //   "You get the strangest feeling that someone is watching you.\u001b[39;49m\u001b[0;10m\r\n"
    // );

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
        ws?.send(text + "\r\n");
        setLastTextMessage(text + "\r\n");
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

