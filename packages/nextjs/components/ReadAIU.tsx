import { FunctionComponent, useCallback, useEffect, useState } from "react";
import IntergalacticReportDisplay from "./IntergalacticReportDisplay";
import MetadataDisplay from "./MetadataDisplay";
import { ethers } from "ethers";
import { useAccount, useContractEvent, useContractRead, usePublicClient } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth/useScaffoldContractRead";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import type { Metadata } from "~~/types/appTypes";
import { useEthersProvider } from "~~/utils/wagmi-utils";

interface ReadAIUProps {
  parsedMetadata: Metadata;
  warping: boolean;
  scannerOutput: any;
  playSpaceshipOn: () => void;
  handleScanning: (scanning: boolean) => void;
  scanning: boolean;
  handleButtonClick: (button: string, type: "character" | "background") => Promise<void>;
  buttonMessageId: string | "";
  engaged: boolean;
  modifiedPrompt: string;
  interplanetaryStatusReport: string;
  playWarpSpeed: () => void;
  playHolographicDisplay: () => void;
  playSpaceshipHum: () => void;
  setTravelStatus: (type: "NoTarget" | "AcquiringTarget" | "TargetAcquired") => void;
  handleEngaged: (engaged: boolean) => void;
  onSelectedTokenIdRecieved: (selectedTokenId: string) => void;
  onMetadataReceived: (metadata: Metadata) => void;
  onImageSrcReceived: (imageSrc: string) => void;
  onTokenIdsReceived: (tokenIds: string[]) => void;
  isFocused: boolean; // Add this prop
  isMinimized: boolean; // Add this prop
  onToggleMinimize: () => void; // Add this prop
  onSubmit: (type: "character" | "background") => Promise<void>;
  travelStatus: string;
}

export const ReadAIU: FunctionComponent<ReadAIUProps> = ({
  parsedMetadata,
  warping,
  scannerOutput,
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
  interplanetaryStatusReport,

  setTravelStatus,
  handleEngaged,
  travelStatus,
  onSubmit,
  onSelectedTokenIdRecieved,
  onMetadataReceived,
  onImageSrcReceived,
  onTokenIdsReceived,
  isFocused, // Destructure the isMinimized prop
  isMinimized,
  onToggleMinimize, // Destructure the onToggleMinimize prop
}) => {
  const { address } = useAccount();

  const [tokenIds, setTokenIds] = useState<string[] | undefined>([]);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [selectedTokenId, setSelectedTokenId] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();
  const provider = useEthersProvider();
  const [metadata, setMetadata] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string>();
  const [mouseTrigger, setMouseTrigger] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(false);
  const [scanOutputIndex, setScanOutputIndex] = useState<number>(0);
  const scannerOptions = ["abilities", "currentEquipmentAndVehicle", "funFact", "powerLevel", "currentMissionBrief"];
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");

  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: BigInt(15795907), // Set an appropriate starting block number
    filters: { to: address },
  });

  const fetchUserBalance = async (address: string, contract: any) => {
    if (!address || !contract) return BigInt(0);
    try {
      return await contract.balanceOf(address);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return BigInt(0);
    }
  };

  const fetchOwnedTokenIds = (transferEvents: any[] | undefined) => {
    if (!transferEvents) return [];
    return transferEvents.map(event => event.args.tokenId.toString());
  };

  const handlePrevious = useCallback(() => {
    playHolographicDisplay();
    setScanOutputIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, [playHolographicDisplay]);

  const handleNext = useCallback(() => {
    playHolographicDisplay();
    setScanOutputIndex(prevIndex => Math.max(prevIndex + 1, 0));
  }, [playHolographicDisplay]);

  const updateAppState = (userBalance: bigint, ownedTokenIds: string[]) => {
    setBalance(userBalance);
    setTokenIds(ownedTokenIds);
    onTokenIdsReceived(ownedTokenIds);
  };

  const resetAppState = () => {
    setBalance(BigInt(0));
    setTokenIds([]);
    onTokenIdsReceived([]);
    setSelectedTokenId("");
  };

  // Outside of the component
  const createEthersContract = () => {
    return deployedContract ? new ethers.Contract(deployedContract.address, deployedContract.abi, provider) : null;
  };

  // Inside your component
  useEffect(() => {
    const fetchTokenIds = async () => {
      if (!address || !deployedContract) {
        resetAppState();
        return;
      }

      const contractInstance = createEthersContract();
      if (!contractInstance) return;

      try {
        const userBalance = await fetchUserBalance(address, contractInstance);
        const ownedTokenIds = fetchOwnedTokenIds(transferEvents);

        userBalance >= BigInt(0) ? updateAppState(userBalance, ownedTokenIds) : resetAppState();
      } catch (error) {
        console.error("Error in fetchTokenIds:", error);
        resetAppState();
      }
    };

    fetchTokenIds();
  }, [address, deployedContract, transferEvents]);

  useEffect(() => {
    const fetchTokenURI = async () => {
      if (!address || !deployedContract || !selectedTokenId) return;

      try {
        const contractInstance = createEthersContract();
        if (!contractInstance) return;

        const uri = await contractInstance.tokenURI(selectedTokenId);
        setTokenURI(uri);
      } catch (error) {
        console.error("Error fetching token URI:", error);
      }
    };

    fetchTokenURI();
  }, [address, selectedTokenId]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;

      try {
        const response = await fetch(tokenURI);
        const json = await response.json();
        setMetadata(json);
        onMetadataReceived(json);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, [tokenURI]);

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
    if (metadata && metadata.image) {
      const ipfsGateway = "https://ipfs.io"; // Choose a gateway
      const imageUrl = metadata.image.replace("ipfs://", `${ipfsGateway}/ipfs/`);
      setImageSrc(imageUrl);
      onImageSrcReceived(imageUrl); // Add this line
    }
  }, [metadata]);
  function stringToHex(str: string): string {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16);
    }
    return hex;
  }

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
                    opacity-100
                    "
        >
          <div onMouseEnter={onToggleMinimize} onMouseLeave={onToggleMinimize} className="spaceship-display-screen">
            <div className="screen-border h-full text-black bg-black">
              {selectedTokenId && travelStatus == "NoTarget" ? (
                <div
                  className="description-text hex-prompt font-bold text-[1rem] 
                                    absolute top-[10%] h-[40%] w-full p-[0.1rem] mt-[-2rem] text-white"
                  onClick={() => handleButton()}
                >
                  ENGAGE WARP DRIVE <br />
                </div>
              ) : (
                travelStatus == "AcquiringTarget" && (
                  <div
                    className="description-text hex-prompt font-bold text-[1rem] 
                                            absolute top-[20%] h-[30%] w-full p-[0.1rem] mt-[-2rem] text-white"
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
                onClick={() => handleButton()}
              >
                {stringToHex(metadata ? metadata.description : "No Metadata")}
              </button>
            </div>
          </div>
          {buttonMessageId !== "" && travelStatus !== "NoTarget" ? <AvailableButtons /> : <div></div>}
        </div>
      }
      <div
        className="toggle-minimize-button spaceship-display-screen
                text-black bg-black opacity-20 pointer-events-none"
      ></div>
      <img
        className="absolute h-[8.9%] w-[5.5%] top-[59.4%] left-[47.6%] opacity-25 hover:opacity-80 z-[1000000] cursor-pointer"
        src="/aiu.png"
        onClick={() => {
          setEngaged(!engaged);
        }}
      ></img>
      <div className={`spaceship-display-screen token-selection-panel${!isMinimized && engaged ? "-focused" : ""}`}>
        <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
          <MetadataDisplay
            parsedMetadata={parsedMetadata}
            scannerOutput={scannerOutput}
            scannerOptions={scannerOptions}
          />
          <IntergalacticReportDisplay
            engaged={engaged}
            selectedTokenId={selectedTokenId ? selectedTokenId : ""}
            travelStatus={travelStatus}
            interplanetaryStatusReport={interplanetaryStatusReport}
            parsedMetadata={parsedMetadata}
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
          {imageSrc && (
            <img
              className="rounded-full absolute h-[70%] w-[28%] 
                            top-[0%] left-[37%] border-[12px] border-black z-[10000100]"
              src={imageSrc}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
