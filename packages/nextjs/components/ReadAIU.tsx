import { FunctionComponent, useEffect, useState } from "react";
import IntergalacticReportDisplay from "./IntergalacticReportDisplay";
import MetadataDisplay from "./MetadataDisplay";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { useGlobalState, useImageStore } from "~~/services/store/store";
import type { ApiResponses } from "~~/types/appTypes";
import { stringToHex, trimmedPrompt } from "~~/utils/nerdUtils";

interface ReadAIUProps {
  warping: boolean;
  scannerOutput: any;
  playSpaceshipOn: () => void;
  handleScanning: (scanning: boolean) => void;
  scanning: boolean;
  handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
  buttonMessageId: string | "";
  engaged: boolean;
  modifiedPrompt: string;
  playWarpSpeed: () => void;
  playHolographicDisplay: () => void;
  playSpaceshipHum: () => void;
  setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
  handleEngaged: (engaged: boolean) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  onMetadataReceived: (metadata: ApiResponses) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  isFocused: boolean; // Add this prop
  isMinimized: boolean; // Add this prop
  onToggleMinimize: () => void; // Add this prop
  onSubmit: (type: "character" | "background") => Promise<void>;
  travelStatus: string;
}

export const ReadAIU: FunctionComponent<ReadAIUProps> = ({
  warping,
  playSpaceshipOn,
  playWarpSpeed,
  playHolographicDisplay,
  playSpaceshipHum,
  handleScanning,
  scanning,
  handleButtonClick,
  buttonMessageId,
  engaged: engagedProp,
  modifiedPrompt,

  setTravelStatus,
  handleEngaged,
  travelStatus,
  onSubmit,
  onSelectedTokenIdRecieved,
  onMetadataReceived,
  onImageSrcReceived,
  isFocused, // Destructure the isMinimized prop
  isMinimized,
  onToggleMinimize, // Destructure the onToggleMinimize prop
}) => {
  const tokenIds = useGlobalState(state => state.tokenIds);
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [metadata, setMetadata] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string>();
  const [mouseTrigger, setMouseTrigger] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(true);
  const scannerOptions = ["abilities", "currentEquipmentAndVehicle", "funFact", "powerLevel", "currentMissionBrief"];
  const parsedMetadata = useGlobalState(state => state.apiResponses);
  const scannerOutput = useGlobalState(state => state.metaScanData);

  const imageState = useImageStore(state => ({
    srcUrl: state.srcUrl,
    imageUrl: state.imageUrl,
    backgroundImageUrl: state.backgroundImageUrl,
    displayImageUrl: state.displayImageUrl,
  }));

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playHolographicDisplay();
    setSelectedTokenId(e.target.value);
    playSpaceshipOn();
    onSelectedTokenIdRecieved(e.target.value); // Add this line
  };

  //the important function
  const handleButton = () => {
    playHolographicDisplay();
    if (travelStatus === "AcquiringTarget" && scanning === false) {
      playWarpSpeed();
      try {
        setTimeout(() => {
          onSubmit("character");
          setTravelStatus("TargetAcquired");
        }, 2100);
      } catch (error) {
        setTravelStatus("NoTarget");
        console.log(error);
      }
    } else if (travelStatus === "AcquiringTarget" && scanning === true) {
      playWarpSpeed();
      try {
        setTimeout(() => {
          handleButtonClick("U1", "background");
          console.log("clicked");
          handleScanning(false);
        }, 2100);
      } catch (error) {
        setTravelStatus("NoTarget");
        console.log(error);
      }
    } else {
      if (selectedTokenId && travelStatus === "NoTarget") {
        setTravelStatus("AcquiringTarget");
        playSpaceshipHum();
        setEngaged(true);
      } else {
        setTravelStatus("NoTarget");
        setEngaged(false);
      }
    }
  };

  useEffect(() => {
    const button = document.getElementById("spaceshipButton");

    if (travelStatus === "AcquiringTarget") {
      button?.classList.add("active");
      button?.classList.remove("loading");
    } else if (travelStatus === "TargetAcquired") {
      button?.classList.add("loading");
      button?.classList.remove("active");
    } else {
      button?.classList.remove("active");
      button?.classList.remove("loading");
    }
  }, [travelStatus]);

  const AvailableButtons = () => {
    const buttons = ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    return (
      <div
        style={{
          display: "flexbox",

          flexDirection: "column",
          columns: 2,
          justifyContent: "space-between",
          height: "116%",
          width: "300%",
          left: "-100%",
          position: "absolute",
          top: "-10%",
          paddingLeft: "3%",
          right: "-20%",
          marginTop: "10%",
          paddingRight: "-30%",
          flexWrap: "wrap",
          whiteSpace: "nowrap",
          zIndex: 1000,
          columnGap: "100px",
        }}
        className="spaceship-button-container spaceship-display-screen"
      >
        {buttons.map(button => (
          <button
            key={button}
            className={`spaceship-button ${
              travelStatus === "TargetAcquired" ? "active" : ""
            } display-text screen-border`}
            style={{
              marginTop: "15%",
              marginBottom: "15%",
              marginLeft: "15%",
              marginRight: "5%",
              padding: button === "🔄" ? "0.5rem" : ".5rem",
              backgroundColor: button === "🔄" ? "black" : "black",
              position: "relative",
              display: "flex",
              fontSize: "1.5rem",
              width: "3.5rem",
            }}
            onClick={() => {
              playWarpSpeed();
              try {
                setTimeout(() => {
                  handleButtonClick(button, "character");
                }, 2100);
              } catch (error) {
                setTravelStatus("NoTarget");
                console.log(error);
              }
            }}
          >
            {button}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {
        <div
          onMouseEnter={() => setMouseTrigger(true)}
          className="toggle-minimize-button spaceship-display-screen 
                    opacity-90 p-1 top-1/2 mt-24
                    "
        >
          <div onMouseEnter={onToggleMinimize} onMouseLeave={onToggleMinimize} className="spaceship-display-screen">
            <div className="screen-border h-full text-black bg-black">
              {selectedTokenId && travelStatus == "NoTarget" ? (
                <div
                  className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[0%] h-full w-full p-[0.1rem] pt-[2rem] text-white"
                  onClick={() => {
                    playHolographicDisplay();
                    handleButton();
                  }}
                >
                  ENGAGE WARP DRIVE <br />
                </div>
              ) : (
                travelStatus == "AcquiringTarget" && (
                  <div
                    className="description-text hex-prompt font-bold text-[1rem] 
                                            absolute top-[20%] h-full w-full p-[0.1rem] mt-[-2rem] text-white"
                    onClick={() => handleButton()}
                  >
                    READY
                  </div>
                )
              )}
              {!selectedTokenId && (
                <div
                  className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[20%] h-[30%] w-full  mt-[-2rem] text-white"
                >
                  SELECT ID
                </div>
              )}
              <br />
              <select
                id="tokenId"
                value={selectedTokenId}
                onChange={handleTokenIdChange}
                className="dropdown-container hex-prompt dropdown-option text-green content-center pl-1 top-[70%]"
              >
                <option value="dropdown-option bg-color-black">-ID-</option>
                {tokenIds?.map(tokenId => (
                  <option
                    key={tokenId}
                    value={tokenId}
                    className="dropdown-option hex-prompt 
                                        dropdown-option  content-center"
                  >
                    {tokenId}
                  </option>
                ))}
              </select>
              <button
                id="spaceshipButton"
                className="spaceship-display-screen hex-data master-button"
                onClick={() => {
                  playHolographicDisplay();
                  handleButton();
                }}
              >
                {stringToHex(metadata ? metadata.description : "No Metadata")}
              </button>
            </div>
          </div>
          {buttonMessageId !== "" && travelStatus !== "NoTarget" ? <AvailableButtons /> : <div></div>}
        </div>
      }
      <IntergalacticReportDisplay
        engaged={engaged}
        selectedTokenId={selectedTokenId ? selectedTokenId : ""}
        setEngaged={setEngaged}
        travelStatus={travelStatus}
        metadata={parsedMetadata}
      />

      <div className={`spaceship-display-screen token-selection-panel${!isMinimized && engaged ? "-focused" : ""}`}>
        <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
          <MetadataDisplay
            playHolographicDisplay={playHolographicDisplay}
            scannerOutput={scannerOutput}
            scannerOptions={scannerOptions}
            imageState={imageState}
          />
          {/*
    

      <ScannerOutput 
        scanOutputIndex={scanOutputIndex} 
        scannerOptions={scannerOptions} 
        scannerOutput={scannerOutput} 
        handlePrevious={handlePrevious} 
        handleNext={handleNext}
      />
  ... [rest of your main component logic, like image display] ... */}
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
