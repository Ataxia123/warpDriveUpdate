import { useState } from "react";
import LogViewer from "./panels/LogViewer";
import { useGlobalState } from "~~/services/store/store";

const MetadataDisplay = (props: {
  scannerOutput: any;
  scannerOptions: string[];
  playHolographicDisplay: () => void;
  imageState: { imageUrl: string };
  engaged: boolean;
  setEngaged: (engaged: boolean) => void;
}) => {
  // ... [your state and function definitions] ...
  const { scannerOutput, scannerOptions, playHolographicDisplay, imageState, engaged, setEngaged } = props;
  const parsedMetadata = useGlobalState(state => state.nftData);
  const planetData = useGlobalState(state => state.planetData);
  const shipState = useGlobalState(state => state.shipState);

  const [count, setCount] = useState(-1);
  const index = () => {
    playHolographicDisplay();
    if (count < scannerOptions.length - 1) {
      setCount(count + 1);
    } else {
      setCount(-1);
    }
  };
  const heroName = JSON.stringify(
    `${parsedMetadata.Level} ${parsedMetadata.Power1} ${parsedMetadata.Power2} ${parsedMetadata.Power3}`,
  );

  const trimmedName = heroName.replace(/undefined/g, "");

  return (
    <div className="absolute spaceship-display-screen left-5 top-1/4 h-full w-full p-3 text-center screen-border">
      <ul className="p-20 relative right-0 mr-10 pr-12 w-[100%] h-[30%]">
        <li className="text-yellow-600 font-bold text-3xl p-1">AI-U</li>
        <li className="text-white font-bold text-2xl">{trimmedName}</li>
        <li>
          LocationId: {planetData?.planetId}
          <br />
          Coordinates: {JSON.stringify(planetData?.locationCoordinates)}
          <br />
        </li>
      </ul>
      <img
        height={500}
        width={500}
        alt="AIU"
        className="absolute rounded-full h-[30%] w-[25%]
                            top-[32%] left-[40.5%] border-[6px] border-black opacity-90"
        src={imageState?.imageUrl ? imageState.imageUrl : "/aiu.png"}
      />
      <div
        className="absolute spaceship-display-screen top-[34.2%] left-12 p-6"
        onClick={() => index()}
        style={{ height: "25%", width: "30%" }}
      ></div>
      <div className="absolute spaceship-display-screen top-[34.2%] right-1 " style={{ height: "25%", width: "30%" }}>
        <LogViewer
          playHolographicDisplay={playHolographicDisplay}
          scannerOptions={scannerOptions}
          scannerOutput={scannerOutput}
        />
      </div>
      a
    </div>
  );
};

export default MetadataDisplay;
