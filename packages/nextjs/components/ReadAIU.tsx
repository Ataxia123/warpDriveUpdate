import { FunctionComponent, useEffect, useState } from "react";
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
  onMetadataReceived: (metadata: any) => void;
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
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
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
  const [scannerOptions, setScannerOptions] = useState<string[]>([
    "abilities",
    "healthAndStatus",
    "equipment",
    "funFact",
  ]);

  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: BigInt(15795907), // Set an appropriate starting block number
    filters: { to: address },
  });

  const fetchUserBalance = async (address: string, contract: any) => {
    if (!address || !contract) return BigInt(0);
    return await contract.balanceOf(address);
  };

  const fetchOwnedTokenIds = (transferEvents: any[] | undefined) => {
    if (!transferEvents) return [];
    return transferEvents.map(event => event.args.tokenId.toString());
  };

  const handlePrevious = () => {
    playHolographicDisplay();
    if (scanOutputIndex > 0) {
      setScanOutputIndex(scanOutputIndex - 1);
    }
  };

  const handleNext = () => {
    playHolographicDisplay();
    console.log("im clicked");
    if (scanOutputIndex < scannerOptions.length - 1) {
      setScanOutputIndex(scanOutputIndex + 1);
    }
  };

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

  useEffect(() => {
    const fetchTokenIds = async () => {
      if (!address || !deployedContract || !tokenIds) {
        resetAppState();
        return;
      }

      const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
      const userBalance = await fetchUserBalance(address, contract);
      const ownedTokenIds = fetchOwnedTokenIds(transferEvents);

      if (userBalance >= BigInt(0)) {
        updateAppState(userBalance, ownedTokenIds);
      } else {
        resetAppState();
      }
    };

    fetchTokenIds();
  }, [address, mouseTrigger, transferEvents]);

  useEffect(() => {
    const fetchTokenURI = async () => {
      if (address && deployedContract && selectedTokenId) {
        const contract = new ethers.Contract(deployedContract.address, deployedContract.abi, provider);
        const uri = await contract.tokenURI(selectedTokenId);
        setTokenURI(uri);
      }
    };

    fetchTokenURI();
  }, [address, deployedContract, selectedTokenId]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          const response = await fetch(tokenURI);
          const json = await response.json();
          setMetadata(json);
          onMetadataReceived(json); // Add this line
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
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
      {" "}
      <div className="fixed top-16 w-60 h-32 scale-75 z-[15000000000000000000000000000000000000000000000000000000000000000]"></div>
      {
        <div onMouseEnter={() => setMouseTrigger(true)} className="toggle-minimize-button spaceship-display-screen">
          <div onMouseEnter={onToggleMinimize} onMouseLeave={onToggleMinimize} className="spaceship-display-screen">
            <div className="screen-border text-black bg-black opacity-80">
              {selectedTokenId && travelStatus == "NoTarget" ? (
                <div
                  className="description-text hex-prompt font-bold text-[1rem] absolute top-[20%] h-[30%] w-full p-[0.1rem] mt-[-2rem] text-white"
                  onClick={() => handleButton()}
                >
                  |N.A.V.| COMPUTER
                  <br />
                  READY
                </div>
              ) : (
                travelStatus == "AcquiringTarget" && (
                  <div
                    className="description-text hex-prompt font-bold text-[1rem] absolute top-[20%] h-[30%] w-full p-[0.1rem] mt-[-2rem] text-white"
                    onClick={() => handleButton()}
                  >
                    ENGAGE WARP DRIVE{" "}
                  </div>
                )
              )}
              {!selectedTokenId && (
                <div className="display-text hex-prompt font-bold text-[1rem] absolute top-[11%] h-[20%] w-full p-[0.1rem] mt-[-2rem]">
                  SELECT ID
                </div>
              )}
              <br />
              <select
                id="tokenId"
                value={selectedTokenId}
                onChange={handleTokenIdChange}
                className="dropdown-container hex-prompt dropdown-option text-green content-center top-[70%] left-[11%]"
              >
                <option value="hex-prompt dropdown-option">-ID-</option>
                {tokenIds?.map(tokenId => (
                  <option key={tokenId} value={tokenId}>
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
      <div className="toggle-minimize-button spaceship-display-screen text-black bg-black opacity-80 pointer-events-none"></div>
      <img
        className="absolute h-[25%] w-[19%] top-[18.4%] left-[40.96%] opacity-25 hover:opacity-80 z-[1000000]"
        src="/aiu.png"
        onClick={() => {
          setEngaged(!engaged);
        }}
      ></img>
      <div className={`spaceship-display-screen token-selection-panel${!isMinimized && engaged ? "-focused" : ""}`}>
        <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
          <div className="absolute z-[1000000000000000] text-[.91rem] p-[.3rem] pb-[0.1rem] pl-[0.8rem] font-bold left-[5%] top-[19%] w-[22.5%] h-[40.5%]">
            <li className="p-[1.4rem] pl-[4.2rem] mb-[1rem] mt-[-1rem] ml-[2.1rem] font-[Orbitron] text-[.70rem]">
              {metadata?.name} METADATA
            </li>
            <ul className="absolute p-[1.5rem] pt-[-0.001rem] pl-[2.8rem] w-[120%] top-[25%] left-[-12.5%] scale-90">
              <br /> Type:
              <span className="text-white font-bold pl-[0.8rem]">{parsedMetadata?.Level}</span>
              <br />
              Power1:
              <span className="text-white font-bold pl-[0.8rem]">{parsedMetadata?.Power1}</span>
              <br />
              Power2:
              <span className="text-white font-bold pl-[0.8rem]">{parsedMetadata?.Power2}</span>
              <br />
              Power3:
              <span className="text-white font-bold pl-[0.8rem]">{parsedMetadata?.Power3}</span>
              <br />
              Side:
              <span className="text-white font-bold pl-[0.1rem]">{parsedMetadata?.Side}</span>
              <br />
              Alignment:
              <br />
              <span className="text-white font-bold pl-[1.5rem]">
                {parsedMetadata?.Alignment1} {parsedMetadata?.Alignment2}
              </span>
            </ul>
          </div>{" "}
          <div className="spaceship-display-screen absolute h-[40%] w-full top-[20%] left-0 flex flex-row">
            <div className="spaceship-display-screen relative bottom-[-60%] top-[-3%] left-[29%] h-full w-[70%] flex pt-[11rem] pr-[4rem] mr-0 ml-[-1rem] pointer-events-auto">
              <div className="text-white p-[1.2rem] z-[10000000000000000000] absolute font-bold text-[1rem] h-[82%] top-[20%] w-[73.8%] left-[-2%]">
                INTERPLANETARY STATUS REPORT
                <div className="spaceship-display-screen text-black pl-[3.1rem] z-[10000000000000000000] relative font-bold text-[1.1rem] h-[95%] overflow-x-hidden overflow-y-scroll">
                  <div>
                    {engaged === false ? (
                      <> #---ENGAGE to ANALYZE---#</>
                    ) : (
                      <>
                        {selectedTokenId === "" ? (
                          <> #SELECT TOKEN to DECODE#</>
                        ) : (
                          <>
                            {travelStatus === "NoTarget" ? (
                              <> #ENABLE N.A.V. COMPUTER#</>
                            ) : (
                              <>
                                {interplanetaryStatusReport === "" ? (
                                  <>
                                    |------ENGAGE SCANNER------|
                                    <br />
                                    |----------TO OBTAIN-----------|
                                    <br />| -INTERPLANETARY REPORT-|
                                  </>
                                ) : (
                                  <>
                                    <span className="spaceship-display-screen relative ml-[-5%] left-[17%] bottom-[-10%]">
                                      <br />
                                      TRANSMISSION FROM:
                                      <br />
                                      <br />
                                      {parsedMetadata?.Level} {parsedMetadata?.Power1} {parsedMetadata?.Power2}
                                    </span>
                                    <br />
                                    <span className="spaceship-display-screen description-text relative top-[2.5rem] ml-[-5%] left-[-7%] mr-[10rem] animate-none text-white">
                                      {parsedMetadata.interplanetaryStatusReport}
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <br />
                    <br />
                    <br />
                  </div>

                  <p className="prompt-data relative text-[0.8rem] font-normal text-white justify-center items-center flex flex-col top-[0.3rem] p-[1rem] left-[-10.2%] h-full w-[110%] pointer-events-auto">
                    {" "}
                  </p>
                  {scannerOutput?.funFact ? (
                    <span className="spaceship-display-screen relative top-[1rem] left-[-0.3rem] w-[110%] h-[110%] pl-0 pr-[.8rem] text-[0.7rem] font-bold text-white pt-0">
                      <br /> FUN FACT: <br />
                      <br />
                      {scannerOutput.funFact}
                    </span>
                  ) : (
                    <span className="spaceship-display-screen absolute ml-[26%] w-[40%] mr-[22%] h-0 top-0 pl-[1.2rem] mb-[20%] text-[0.8rem] font-normal">
                      ENGAGE N.A.V. COMPUTER TO DECODE DATA
                      <br />
                    </span>
                  )}
                  <br />
                </div>
              </div>
            </div>
            <div className="hex-data z-[-11111]">
              <div className="spaceship-display-screen absolute top-[17%] left-[68.2%] h-[85%] w-[35%] flex flex-col justify-center items-center pointer-events-auto">
                <div className="hex-prompt display-border mt-[7%] ml-[-1rem] p-[1rem] pr-[3.2rem] h-[90%] w-[90%] text-[0.8rem] pointer-events-auto overflow-y-scroll">
                  <span className="spaceship-display-screen absolute top-[1.5rem] w-[60%] left-[1.4rem] text-[0.85rem] pointer-events-auto h-[18%] leading-[0.8rem]">
                    SCANNER OUTPUT: <br />
                    {scanOutputIndex + 1}/{scannerOptions.length}
                    <br />
                  </span>
                  <div className="absolute top-[15%] text-[0.9rem] pointer-events-auto spaceship-display-screen  w-[85%] pt-[.5rem] pl-0 pr-0 left-0 leading-[0.8rem]  h-[66%] flex p-[0.5rem] overflow-y-scroll flex-col text-white">
                    <button onClick={() => handlePrevious()}> {`<<`} </button> ||
                    <button
                      onClick={() => {
                        handleNext();
                        console.log("I'm Clicked");
                      }}
                    >{`>>`}</button>
                  </div>
                  <span className="hex-prompt relative">{scannerOptions[scanOutputIndex]}:</span>
                  <br />
                  <span className="hex-prompt relative top-[0.7rem]">
                    {scannerOutput[scannerOptions[scanOutputIndex]]}
                  </span>
                </div>{" "}
              </div>
            </div>
            {stringToHex(metadata ? metadata.description : "No Metadata")}
          </div>
          {imageSrc && (
            <img
              className="rounded-full absolute h-[70%] w-[28%] top-[-45%] left-[37%] border-[12px] border-black z-[10000100]"
              src={imageSrc}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ReadAIU;
