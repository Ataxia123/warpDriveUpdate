import { useGlobalState, useQuipuxStore } from "~~/services/store/store";
import type { ApiResponses, Response } from "~~/types/appTypes";
import { stringToHex } from "~~/utils/nerdUtils";
import type { Location } from "~~/types/appTypes";

interface PromptPanelProps {
    loadingProgress: number;
    error: string;
    buttonMessageId: string | "";
    imageUrl: string;
    srcUrl: string | null;
    loading: boolean;
    onSubmitPrompt: (type: "character" | "background") => Promise<void>;
    onSubmit: (type: "character" | "background") => Promise<void>;
    handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const MarqueePanel: React.FC<PromptPanelProps> = ({ imageUrl, loadingProgress, error }) => {
    const interplanetaryStatusReport = useQuipuxStore(state => state.questData);
    const nftData = useGlobalState(state => state.nftData);
    //const myData = useGlobalState(state => state.myData);
    const myData = useQuipuxStore(state => state.database);
    const gstate = useGlobalState(state => state);

    const { ships: myShip, planetData: myLocations, quipux: myQuipuxs, pilotData: myPilot } = myData;

    const pilot = myPilot ? myPilot[0] : ""
    const ship = myShip ? myShip[0] : ""
    const location: Location = myLocations ? myLocations[0] : {};
    const quipux = myQuipuxs ? myQuipuxs[0] : ""
    return (
        <>

            <div className="absolute marquee-container spaceship-display-screen max-h-[9%] mb-44">
                <h2 className="font-bold marquee-title -bottom-1.5 description-text">AI-U BROADCAST</h2>
                <strong className="marquee-title left-2">BROADCAST ID: <span className=" text-white right-2 text-right">
                    {location.quadrantId}</span></strong>
                <strong className="marquee-title left-6 -bottom-5 p-2"> Loading:{loadingProgress}</strong>
                <div
                    className="screen-border">

                    <div
                        className="spaceship-screen-display"
                    >
                        <ul className="hex-prompt">

                            <li className="w-max relative top-7 spaceship-screen-display marquee-content"
                                style={{ width: "max-content" }}
                                id="mc">
                                {gstate.selectedDescription}
                                MANIFEST:{JSON.stringify(ship.shipData?.state)}
                            </li>
                        </ul>
                    </div>
                    <br />


                </div>

            </div>
            <div className={"absolute h-[20%] w-[12%] top-1/4 mt-0 left-[44.4%]"}
            >
                <img
                    alt="AIU"

                    className="relative w-full h-full  p-2 rounded-full screen-border backdrop-blur-2xl"
                    src={imageUrl ? imageUrl : "/assets/aiu.jpg"}
                />
            </div>
        </>
    );
};
