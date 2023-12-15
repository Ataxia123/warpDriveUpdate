import { useState } from "react";
import LogViewer from "./panels/LogViewer";
import ShipSpinner from "~~/components/ShipSpinner";
import { useGlobalState } from "~~/services/store/store";

const MetadataDisplay = (props: {
  scannerOutput: any;
  scannerOptions: string[];
  playHolographicDisplay: () => void;
  imageState: { imageUrl: string };
}) => {
  // ... [your state and function definitions] ...
  const { scannerOutput, scannerOptions, playHolographicDisplay, imageState } = props;
  const parsedMetadata = useGlobalState(state => state.nftData);
  const planetData = useGlobalState(state => state.planetData);

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
        <li className="text-yellow-600 text-3xl p-1">AI-U SIGNAL FROM</li>
        <li className="text-white font-bold text-2xl p-3">{trimmedName}</li>
        <li>
          LocationId: {planetData.planetId}
          <br />
          Coordinates: {JSON.stringify(planetData.locationCoordinates)}
          <br />
        </li>
      </ul>
      <img
        height={500}
        width={500}
        alt="AIU"
        className="absolute rounded-full h-[30%] w-[25%]
                            top-[32%] left-[39.5%] border-[6px] border-black opacity-90"
        src={imageState.imageUrl ? imageState.imageUrl : "/aiu.png"}
      />
      <div
        className="absolute spaceship-display-screen top-[34.2%] left-12 p-6 overflow-y-auto overflow-x-clip"
        onClick={() => index()}
        style={{ height: "25%", width: "30%" }}
      >
        {parsedMetadata ? (
          <div className="cursor-pointer">
            <ul>
              {count == -1 && (
                <ul>
                  METADATA
                  <li>
                    Alliance:
                    <br />
                    <span className="text-white font-bold p-3">{parsedMetadata?.Side}</span>
                  </li>
                  <li>
                    Alignment:
                    <br />
                    <span className="text-white font-bold p-2">
                      {parsedMetadata?.Alignment1} {parsedMetadata?.Alignment2}
                    </span>
                  </li>
                </ul>
              )}
              <span className="text-white text-2xl p-1">{scannerOptions[count]} </span> <br />
              <div className="text-sm">{scannerOutput[scannerOptions[count]]}</div>
            </ul>
          </div>
        ) : (
          <>
            <span className="">
              DECODING SCAN RESULTS
              <br />
            </span>
          </>
        )}
      </div>
      <div
        className="absolute spaceship-display-screen top-[34.2%] right-1 overflow-y-auto overflow-x-clip"
        style={{ height: "25%", width: "30%" }}
      >
        <LogViewer playHolographicDisplay={playHolographicDisplay} />
      </div>
      a
    </div>
  );
};

export default MetadataDisplay;
