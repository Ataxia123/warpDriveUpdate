import React, { useState } from "react";
import { useAppStore, useGlobalState, useImageStore } from "~~/services/store/store";
import type { ApiResponses, ChatData, InterPlanetaryStatusReport, MetaScanData, PlanetData } from "~~/types/appTypes";

// Dummy data for demonstration purposes

interface LogViewerProps {
  playHolographicDisplay: () => void;
  scannerOptions: string[];
  scannerOutput: MetaScanData;
}
const LogViewer: React.FC<LogViewerProps> = ({ playHolographicDisplay, scannerOptions, scannerOutput }) => {
  const {
    chatData,
    setChatData,
    planetData,
    interPlanetaryStatusReport,
    metaScanData,
    nftData,
    shipState,
    handleApiResponse,
  } = useGlobalState(state => ({
    setMetadata: state.setApiResponses,
    travels: state.travels,
    setTravels: state.setTravels,
    interPlanetaryStatusReport: state.interPlanetaryStatusReport,
    metaScanData: state.metaScanData,
    shipState: state.shipState,
    nftData: state.nftData,
    handleApiResponse: state.setApiResponses,
    planetData: state.planetData,
    chatData: state.chatData,
    setChatData: state.setChatData,
  }));

  const { srcUrl, imageUrl, displayImageUrl } = useImageStore(state => state);
  const imageState = { srcUrl, imageUrl, displayImageUrl };

  const metaScanner = { nftData, metaScanData, IPSR: interPlanetaryStatusReport };
  const pilotData = {};

  const [dataIndex, setDataIndex] = useState(0);
  const [dataCategory, setDataCategory] = useState("shipState");
  const dataCategories = [
    "imageData",
    "interPlanetaryStatusReport",
    "metaScanData",
    "shipState",
    "chatData",
    "pilotData",
  ];
  const dataCategoryOptions = {
    interPlanetaryStatusReport: Object.keys(interPlanetaryStatusReport || {}),
    metaScanData: Object.keys(metaScanner || {}),
    shipState: Object.keys(shipState || {}),
    chatData: Object.keys(chatData || {}),
    imageData: Object.keys(imageState || {}),
    pilotData: Object.keys(pilotData || {}),
  };

  const displayNames = {
    planetData: "Planet",
    shipState: "Ship",
    metaScanData: "AIU",
    interPlanetaryStatusReport: "IPSR",
    imageData: "Viewport",
    chatData: "N.A.V.I.",
    nftData: "NFT",
    pilotData: "Pilot",
  };

  const apiResponses: Partial<ApiResponses> = {
    chatData,
    interPlanetaryStatusReport,
    metaScanData,
    nftData,
    planetData,
    shipState,
  };

  const handleDataCategoryChange = (category: string) => {
    playHolographicDisplay();
    handleApiResponse(apiResponses);
    setDataCategory(category);
    setDataIndex(0); // Reset index when changing category
  };

  const handleDataIndexChange = (change: number) => {
    const options = dataCategoryOptions[dataCategory as keyof typeof dataCategoryOptions];
    let newIndex = dataIndex + change;
    if (newIndex >= options.length) {
      newIndex = 0; // Wrap around to the beginning
    } else if (newIndex < 0) {
      newIndex = options.length - 1; // Wrap around to the end
    }
    setDataIndex(newIndex);
    playHolographicDisplay();
  };

  const currentData = apiResponses[dataCategory as keyof ApiResponses];
  const currentOption = dataCategoryOptions[dataCategory as keyof typeof dataCategoryOptions][dataIndex];

  const [displayData, setDisplayData] = useState<any>(null);

  const handleOptionClick = (option: any) => {
    if (Array.isArray(option) || typeof option === "object") {
      setDisplayData(option);
    } else {
      playHolographicDisplay();
    }
  };

  const renderOutput = (output: any) => {
    if (Array.isArray(output)) {
      return (
        <ul>
          {output.map((item, index) => (
            <li key={`item-${index}`} onClick={() => handleOptionClick(item)}>
              {index}{" "}
              <span className="hover:text-green-500">
                {typeof item === "object" ? JSON.stringify(item, null, 2) : item}
              </span>
            </li>
          ))}
        </ul>
      );
    } else if (typeof output === "object" && output !== null) {
      return (
        <div>
          {Object.entries(output).map(([key, value], index) => (
            <div
              className=""
              key={`entry-${key}-${index}`}
              onClick={() => {
                playHolographicDisplay();
                handleOptionClick(value);
              }}
            >
              <strong>{key}:</strong>
              <span className="hover:text-green-500"> {JSON.stringify(value, null, 2)}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return <span>{output}</span>;
    }
  };

  const currentOutput =
    displayData || (currentData ? currentData[currentOption as keyof typeof currentData] : "Loading...");

  return (
    <div className="relative spaceship-screen-display top-2">
      <div className="spaceship-screen-display cursor-pointer hex-prompt flex flex-row">
        <img
          height={500}
          width={500}
          alt="AIU"
          className="relative rounded-badge h-[30%] w-[25%]
                            top-[8%] left-[0.5%] border-[6px] border-black opacity-90"
          src={imageState?.imageUrl ? imageState.imageUrl : "/aiu.png"}
        />

        <div className="flex-wrap p-2 h-[100%]">
          <div className="relative spaceship-screen-display">
            {dataCategories.map(category => (
              <button
                key={category}
                onClick={() => {
                  handleDataCategoryChange(category);
                  setDisplayData(null); // Reset display data when changing category
                }}
                className={`m-1 overflow-hidden text-left hex-prompt w-[25%] ${
                  dataCategory === category ? "active " : ""
                } ${
                  !dataCategoryOptions[category as keyof typeof dataCategoryOptions].length
                    ? "hover:text-red-400"
                    : "hover:text-green-400"
                }`}
              >
                {displayNames[category as keyof typeof displayNames]}
              </button>
            ))}
          </div>
          <button className="" onClick={() => handleDataIndexChange(1)}>
            Previous
          </button>{" "}
          || <button onClick={() => handleDataIndexChange(-1)}>Next</button>
          <br />
          <strong className="text-xl text-white">{dataCategory} :</strong>
          {renderOutput(currentOption)}
        </div>
      </div>
      <div className="text-center">
        <div>
          <span className="text-left hex-prompt cursor-pointer">{renderOutput(currentOutput)}</span>
        </div>
      </div>
    </div>
  );
};
export default LogViewer;

{
  /*

export type ApiResponses = {
    interPlanetaryStatusReport: InterPlanetaryStatusReport;
    nftData: NftData;
    metaScanData: MetaScanData;
    planetData: PlanetData;
    chatData: ChatData;
    imageData: Response;
    midjourneyConfig: MidjourneyConfig;
    shipState: ShipState;
};

export type InterPlanetaryStatusReport = {
    missionId: string;
    location: { planet_name: string; coordinates: { x: number; y: number; z: number } };
    characters: { fName: string; members: string[] };
    objective: string;
    status: string;
    surroundingsDescription: string;
    conflictDescription: string;
    metadata: { difficulty: number; EXPrewards: number; missionId: string };
    narrative: string;
};

export type NftData = {
    Level: string;
    Power1: string;
    Power2: string;
    Power3: string;
    Power4: string;
    Alignment1: string;
    Alignment2: string;
    Side: string;
};
export type MetaScanData = {
    heroId: string;
    biometricReading: { health: number; status: string[] };
    currentEquipmentAndVehicle: string[];
    currentMissionBrief: string;
    abilities: string[];
    powerLevel: number;
    funFact: string;
    currentLocation: { x: number; y: number; z: number };
    blockNumber: string;
};

export type ShipState = {
    shipId: string;
    pilot: string;
    inventory: { fuel: number; supplies: number; cargo: { name: string; units: number; } };
    navigationData: {

        location: { x: number; y: number; z: number };
        sectorId: string;
        nearestPlanetId: string;
        navigationNotes: string,
    },
};
export type PlanetData = {
    planetId: string;
    locationCoordinates: { x: number; y: number; z: number };
    Scan: {
        locationName: string;
        enviromental_analysis: string;
        historical_facts: string[];
        known_entities: string[];
        NavigationNotes: string;
        DescriptiveText: string;
        controlledBy: boolean | null;
    };
};
export type shipStatusReport = {
    shipState: ShipState,
    planetScan: PlanetData,
    DescriptiveText: string,
};

export type ChatData = {
    messages: string[];
    chatId: string;
};
*/
}
