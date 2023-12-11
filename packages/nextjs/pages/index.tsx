// index.tsx
import { useCallback, useEffect, useState } from "react";
import AudioController from "../components/AudioController";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import { useAppStore, useGlobalState, useImageStore } from "../services/store/store";
import axios from "axios";
import { ethers } from "ethers";
import GraphemeSplitter from "grapheme-splitter";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import type {
  ApiResponses,
  ChatData,
  MetaScanData,
  NftData,
  PilotData,
  PlanetData,
  ProgressResponseType,
  Response,
  ShipState,
  Sounds,
} from "~~/types/appTypes";
import { generatePrompt } from "~~/utils/nerdUtils";
import { useEthersProvider } from "~~/utils/wagmi-utils";

export default function Home() {
  const { address } = useAccount();
  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: BigInt(15795907), // Set an appropriate starting block number
    filters: { to: address },
  });

  // Outside of the component
  // WEB3 STUFF
  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");

  const provider = useEthersProvider();
  const createEthersContract = () => {
    return deployedContract ? new ethers.Contract(deployedContract.address, deployedContract.abi, provider) : null;
  };
  const contractInstance = createEthersContract();
  const appStateGlobal = useAppStore(state => state);
  const imgStore = useImageStore(state => state);
  const [sounds, setSounds] = useState<Sounds>({});
  const [audioController, setAudioController] = useState<AudioController | null>(null);
  const [tokenURI, setTokenURI] = useState<string>();
  const [toggle, setToggle] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);
  const intakeForm = useGlobalState(state => state.intakeForm);
  const setIntakeForm = useGlobalState(state => state.setIntakeForm);

  const appStore = useAppStore(state => state);
  //session storage
  //STATE STUFF
  const {
    setImageUrl,
    imageUrl,
    setBackgroundImageUrl,
    setdisplayImageUrl: setDisplayImageUrl,
    resetImages,
  } = imgStore;

  const {
    reset,
    setNftData,
    setPlanetData,
    setMetaScanData,
    setTokenIds,
    setInterplanetaryStatusReport,
    setMidjourneyConfig,
    shipState,
    setShipState,
    midjourneyConfig,
    engaged,
    setEngaged,
    metaScanData,
    interplanetaryStatusReport,
    planetData,
    nftData,
    travels,
    setApiResponses,
  } = useGlobalState(state => ({
    reset: state.reset,
    setNftData: state.setNftData,
    setPlanetData: state.setPlanetData,
    setMetaScanData: state.setMetaScanData,
    setTokenIds: state.setTokenIds,
    setInterplanetaryStatusReport: state.setInterPlanetaryStatusReport,
    setMidjourneyConfig: state.setMidjourneyConfig,
    shipState: state.shipState,
    setShipState: state.setShipState,
    midjourneyConfig: state.midjourneyConfig,
    engaged: state.engaged,
    setEngaged: state.setEngaged,
    metaScanData: state.metaScanData,
    interplanetaryStatusReport: state.interPlanetaryStatusReport,
    planetData: state.planetData,
    nftData: state.nftData,
    travels: state.travels,
    setApiResponses: state.setApiResponses,
  }));
  const {
    loading,
    setloading,
    loadingProgress,
    setloadingProgress,
    originatingMessageId,
    setOriginatingMessageId,
    error,
    setError,
    waitingForWebhook,
    setWaitingForWebhook,
    description,
    setDescription,
    selectedDescriptionIndex,
    setSelectedDescriptionIndex,
    selectedTokenId,
    setSelectedTokenId,
    buttonMessageId,
    setButtonMessageId,
    backgroundImageUrl,
    travelStatus,
    setTravelStatus,
    prevTravelStatus,
    setPrevTravelStatus,
    setSelectedDescription,
    modifiedPrompt,
    setModifiedPrompt,
    warping,
    setWarping,
    scanning,
    setScanning,
    preExtraText,
    setPreExtraText,
    AfterExtraText,
    setAfterExtraText,
  } = useAppStore(state => ({
    loading: state.loading,
    setloading: state.setloading,
    loadingProgress: state.loadingProgress,
    setloadingProgress: state.setloadingProgress,
    originatingMessageId: state.originatingMessageId,
    setOriginatingMessageId: state.setOriginatingMessageId,
    error: state.error,
    setError: state.setError,
    waitingForWebhook: state.waitingForWebhook,
    setWaitingForWebhook: state.setWaitingForWebhook,
    description: state.description,
    setDescription: state.setDescription,
    selectedDescriptionIndex: state.selectedDescriptionIndex,
    setSelectedDescriptionIndex: state.setSelectedDescriptionIndex,
    selectedTokenId: state.selectedTokenId,
    setSelectedTokenId: state.setSelectedTokenId,
    buttonMessageId: state.buttonMessageId,
    setButtonMessageId: state.setButtonMessageId,
    backgroundImageUrl: state.backgroundImageUrl,
    setBackgroundImageUrl: state.setBackgroundImageUrl,
    travelStatus: state.travelStatus,
    setTravelStatus: state.setTravelStatus,
    prevTravelStatus: state.prevTravelStatus,
    setPrevTravelStatus: state.setPrevTravelStatus,
    selectedDescription: state.selectedDescription,
    setSelectedDescription: state.setSelectedDescription,
    modifiedPrompt: state.modifiedPrompt,
    setModifiedPrompt: state.setModifiedPrompt,
    warping: state.warping,
    setWarping: state.setWarping,
    scanning: state.scanning,
    setScanning: state.setScanning,
    preExtraText: state.preExtraText,
    setPreExtraText: state.setPreExtraText,
    AfterExtraText: state.AfterExtraText,
    setAfterExtraText: state.setAfterExtraText,
  }));

  const metadata: ApiResponses = {
    interPlanetaryStatusReport: interplanetaryStatusReport,
    nftData,
    metaScanData,
    planetData,
    chatData: {} as ChatData,
    midjourneyConfig,
    imageData: {} as Response,
    shipState,
    pilotData: {} as PilotData,
  };

  useEffect(() => {
    if (!metadata) return;
    setApiResponses(metadata);
  }, [interplanetaryStatusReport]);

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
    if (!transferEvents || !address) return [];
    return transferEvents.map(event => event.args.tokenId.toString());
  };

  const fetchMetadata = async (tokenId: string) => {
    if (!address || !transferEvents || !tokenId) return;
    try {
      if (!contractInstance) return;
      const uri = await contractInstance.tokenURI(tokenId);
      const response = await fetch(uri);
      const json = await response.json();
      setTokenURI(json);
      console.log(uri, json);
      handleMetadataReceived(json);
    } catch (error) {
      console.error("Error fetching token URI:", error);
    }
  };

  const updateAppState = (ownedTokenIds: string[]) => {
    setTokenIds(ownedTokenIds);
  };

  const resetAppState = () => {
    reset();
    resetImages();
  };

  const fetchTokenIds = async () => {
    if (!address || !transferEvents) {
      console.log("No address or deployed contract");
      resetAppState();
      return;
    }
    if (!contractInstance) return;

    try {
      const userBalance = await fetchUserBalance(address, contractInstance);
      const ownedTokenIds = fetchOwnedTokenIds(transferEvents);

      userBalance >= BigInt(0) ? updateAppState(ownedTokenIds) : resetAppState();
      console.log("tokenIds", ownedTokenIds, "userBalance", userBalance);
    } catch (error) {
      console.error("Error in fetchTokenIds:", error);
      resetAppState();
    }
  };

  const handleMetadataReceived = (metadata: any) => {
    console.log("Metadata received in the parent component:", metadata);
    // Extract the attributes from the metadata
    const attributes = metadata?.attributes.reduce((acc: any, attr: any) => {
      acc[attr.trait_type] = attr.value;
      return acc;
    }, {});
    const ipfsGateway = "https://ipfs.ai-universe.io"; // Choose a gateway
    const imageUrl = metadata?.image.replace("ipfs://", `${ipfsGateway}/ipfs/`);
    console.log("attributes", metadata);
    if (!attributes) return;
    const nftQuery = {
      Level: attributes?.Level,
      Power1: attributes["Power 1"],
      Power2: attributes["Power 2"],
      Power3: attributes["Power 3"],
      Power4: attributes["Power 4"],
      Alignment1: attributes["Alignment 1"],
      Alignment2: attributes["Alignment 2"],
      Side: attributes.Side,
    };

    setNftData(nftQuery);
    fetchScanningReport(nftData);

    toast.success(`
                INCOMING TRANSMISSION\n
            Established connection with:\n
            ${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2}\n
            Agent #${selectedTokenId} of the A.I.U.
           `);

    setImageUrl(imageUrl);
    setMidjourneyConfig({ url: imageUrl });
  };

  const bMessageId = buttonMessageId;

  const { url: srcUrl, nijiFlag, selectedDescription, vFlag } = midjourneyConfig || {};

  let count: number;

  // TRAVEL HANDLER
  //
  //
  //
  const pilotData = async () => {
    try {
      const response = await axios.post("/api/scanning_result", {
        metadata: intakeForm,
      });
      console.log("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
      const r = JSON.parse(response.data.scannerOutput.rawOutput);
      setMetaScanData(r);
      toast.success(
        `
                        AGENT LOCATION: ${JSON.stringify(r.currentLocation)}\n
                        Current Mission Brief: ${JSON.stringify(r.currentMissionBrief)}\n
                        RESULT SENT TO BACKEND"`,
      );
      setMetaScanData(JSON.parse(response.data.scannerOutput.rawOutput));
      return r;
    } catch (error) {
      console.error("Error fetching scanning report:", error);
    }
  };

  const fetchScanningReport = async (nftQuery: NftData) => {
    try {
      const response = await axios.post("/api/scanning_result", {
        metadata: nftQuery,
      });
      console.log("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
      const r = JSON.parse(response.data.scannerOutput.rawOutput);
      setMetaScanData(r);
      toast.success(
        `
                        AGENT LOCATION: ${JSON.stringify(r.currentLocation)}\n
                        Current Mission Brief: ${JSON.stringify(r.currentMissionBrief)}\n
                        RESULT SENT TO BACKEND"`,
      );
      setMetaScanData(JSON.parse(response.data.scannerOutput.rawOutput));
      return r;
    } catch (error) {
      console.error("Error fetching scanning report:", error);
    }
  };

  const fetchInterplanetaryStatusReport = async () => {
    try {
      const response = await axios.post("/api/generate_report", {
        metaScanData,
        nftData,
        planetData,
      });

      const t = JSON.parse(response.data.report);

      setInterplanetaryStatusReport(t);

      toast.success(`AI-U IPS Report Recieved\n
                            MissionId: ${response.data.report.missionId}
                            objective:${t.objective}
                            Mission Data: ${JSON.stringify(t.metadata)}`);
      count = NaN;
      return t;
    } catch (error) {
      count = NaN;
      console.error("Error fetching interplanetary status report:", error);
    }
  };

  const fetchTargetPlanet = async () => {
    try {
      const response = await axios.post("/api/alienEncoder", {
        shipState,
      });
      const s = JSON.parse(response.data.newShipStatus);
      travels.push(s);
      setShipState(s);
      toast.success(`SYSTEMS OPERATIONAL\n)`);
      return s;
    } catch (error) {
      console.error("Error fetching target planet:", error);
    }
  };

  async function fetchProgress(
    messageId: string,
    expireMins = 2,
    retries = 3,
    delay = 1000,
  ): Promise<ProgressResponseType> {
    try {
      const response = await axios.get("/api/getProgress", {
        params: {
          messageId,
          expireMins,
        },
      });

      console.log("Response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error response:", error.response);

      if (retries > 0) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        return fetchProgress(messageId, expireMins, retries - 1, delay);
      } else {
        throw error;
      }
    }
  }

  // handler for Generating images
  const submitPrompt = async (type: "character" | "background") => {
    let prompt = generatePrompt(type, metadata);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    setWaitingForWebhook(true);
    setWarping(true);

    if (modifiedPrompt !== "ALLIANCE OF THE INFINITE UNIVERSE" && type === "character") {
      prompt = modifiedPrompt;
    }
    console.log("WARP DRIVE IS CHARACTER IN ENGAGED", { warping, prompt });

    try {
      const r = await axios.post("/api/image", { text: prompt });

      console.log("response", r);
      // Set the appropriate state based on the type

      let taskComplete = false;
      while (taskComplete == false && r.data.messageId) {
        try {
          const progressData = await fetchProgress(r.data.messageId);
          console.log(
            "Progress:",
            progressData.progress,
            progressData.response.buttonMessageId,
            progressData.response.originatingMessageId,
          );
          console.log(progressData);

          // Check if the progress is 100 or the task is complete
          if (progressData.progress === 100 && progressData.response.imageUrl) {
            setDisplayImageUrl(progressData.response.imageUrl);
            const messageId = progressData.response.buttonMessageId;
            setButtonMessageId(messageId || "");
            console.log(buttonMessageId);

            setWaitingForWebhook(false);
            taskComplete = true;
          } else if (
            progressData.progress === "incomplete" ||
            progressData.response.description === "Could not validate this link. Please try again later."
          ) {
            // Handle error case
            console.error("Error: Task is incomplete");
            taskComplete = true;

            setWaitingForWebhook(false);

            break;
          } else {
            // Update loading state with progressData.progress
            console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);

            setloadingProgress(progressData.progress);

            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 1 second before polling again
          }
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 1 second before polling again
        }
      }
    } catch (e: any) {
      console.log(e);
      setError(e.message);
      setWarping(false);
      setTravelStatus("NoTarget");
      setScanning(false);

      setloadingProgress(0);
    }

    setloadingProgress(0);
  };

  // handler for upscaling images
  //
  //

  const handleButtonClick = async (button: string, type: "character" | "background") => {
    console.log("handleButtonClickhandleButtonClickhandleButtonClick", button, type);
    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    setWaitingForWebhook(true);
    if (type === "background") {
      console.log("buttonMessageId", buttonMessageId);
      setTravelStatus("TargetAcquired");
      setWarping(true);
    } else if (travelStatus === "AcquiringTarget") {
      console.log("buttonMessageId", buttonMessageId);
      setTravelStatus("TargetAcquired");
      setWarping(true);
    }

    try {
      console.log("button", button, bMessageId);
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId: bMessageId });

      console.log("response", r);

      const taskComplete = false;
      let buttonCommandResponse, buttonId, imageUrl;
      buttonId = r.data.messageId;

      // Poll the server to fetch the response from the cache

      while (!taskComplete && !buttonCommandResponse) {
        console.log(r.data, "OG MESSAGE", buttonId);
        try {
          const progressData = (await fetchProgress(buttonId)) as ProgressResponseType;

          console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);
          console.log(progressData);

          // Check if the progress is 100 or the task is complete
          if (
            progressData.progress === 100 &&
            progressData.response.imageUrl &&
            progressData.response.buttonMessageId
          ) {
            buttonCommandResponse = progressData;
            imageUrl = progressData.response.imageUrl;
            buttonId = progressData.response.buttonMessageId;
            if (type === "character") {
              setImageUrl(imageUrl);

              setButtonMessageId(r.data.buttonMessageId);
            } else {
              setBackgroundImageUrl(buttonId);

              setButtonMessageId(r.data.buttonMessageId);
            }
          } else if (progressData.progress === "incomplete") {
            // Handle error case
            console.error("Error: Task is incomplete");
            break;
          } else {
            // Update loading state with progressData.progress
            console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);

            setButtonMessageId(r.data.buttonMessageId);
            setloadingProgress(progressData.progress);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
          }
        } catch (error: any) {
          if (error.response.status !== 404) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
        }
      }

      if (type === "character") {
        setDisplayImageUrl(imageUrl ? imageUrl : "");
      } else if (type === "background") {
        setBackgroundImageUrl(imageUrl || "");
        setImageUrl(imageUrl || "");
      }

      setTravelStatus("NoTarget");

      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);

      setError(e.message);
      setWarping(false);
      setTravelStatus("NoTarget");
      setScanning(false);

      setloadingProgress(0);
    }

    setWaitingForWebhook(false);
    setBackgroundImageUrl(imageUrl);
    setWarping(false);
    setTravelStatus("NoTarget");
    setScanning(false);

    setloadingProgress(0);
    // handleDescribeClick();
  };
  const handleDescribeClick = async () => {
    console.log(
      `Submitting image URL: ${scanning && backgroundImageUrl ? backgroundImageUrl : imageUrl ? imageUrl : srcUrl}`,
    );
    setloading(true);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }
    fetchInterplanetaryStatusReport();
    setWaitingForWebhook(true);

    const url = scanning && backgroundImageUrl ? backgroundImageUrl : imageUrl ? imageUrl : srcUrl;
    console.log("url", url);
    try {
      const response = await axios.post("/api/postDescription", {
        url: url,
      });

      // Remove the first grapheme (emoji) from each string in the description array
      const splitter = new GraphemeSplitter();
      console.log("response.data.response.content", response.data);
      const cleanedDescription = response.data.response.content.map((desc: string) => {
        const graphemes = splitter.splitGraphemes(desc);
        return graphemes.slice(1).join("");
      });

      setDescription(cleanedDescription);
      setSelectedDescription(cleanedDescription[0]);
    } catch (e: any) {
      console.log(e);
      setWaitingForWebhook(false);
      setBackgroundImageUrl(imageUrl);
      setWarping(false);
      setTravelStatus("NoTarget");
      setScanning(false);

      setloadingProgress(0);
      // handleDescribeClick();
    }

    setWaitingForWebhook(false);
  };

  const loadSounds = useCallback(async () => {
    const spaceshipOn = await audioController?.loadSound("/audio/spaceship-on.wav");
    const spaceshipHum = await audioController?.loadSound("/audio/spaceship-hum.wav");
    const holographicDisplay = await audioController?.loadSound("/audio/holographic-display.wav");
    const warpSpeed = await audioController?.loadSound("/audio/warp-speed.wav");

    if (spaceshipOn) {
      audioController?.playSound(spaceshipOn, true, 0.02);
      // Pass 'true' as the second argument to enable looping
    }

    setSounds({
      spaceshipOn,
      spaceshipHum,
      holographicDisplay,
      warpSpeed,
    });

    setSoundsLoaded(true);
  }, [audioController, soundsLoaded]);
  // AUDIO SETUP
  useEffect(() => {
    setAudioController(new AudioController());
  }, []);

  useEffect(() => {
    if (audioController && !soundsLoaded) {
      loadSounds();
    }
  }, [audioController, soundsLoaded, loadSounds]);

  useEffect(() => {
    if (sounds.spaceshipOn) {
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
    }
  }, [sounds.spaceshipOn]);

  useEffect(() => {
    if (address && toggle!) {
      fetchTargetPlanet();
      setToggle(true);

      console.log("toggled", toggle);
    } else return;
    console.log("toggle", toggle);
    setShipState({ pilot: address });
  }, [address]);

  useEffect(() => {
    fetchMetadata(selectedTokenId);
  }, [address, selectedTokenId]);
  // Inside your component
  useEffect(() => {
    fetchTokenIds();
  }, [address, deployedContract, transferEvents]);

  useEffect(() => {
    setPrevTravelStatus("travelStatus");
    console.log("prevTravelStatus", prevTravelStatus);
    if (travelStatus === "NoTarget" && prevTravelStatus === "TargetAcquired") {
      // setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
      console.log("GENERATED TRAVEL OUTPUT:", travels[1]);
    }
  }, [travelStatus]);

  // SOUND EFFECTS
  function playSpaceshipHum() {
    if (sounds.spaceshipHum) {
      audioController?.playSound(sounds.spaceshipHum, false, 0.6);
    }
  }

  function playSpaceshipOn() {
    if (sounds.spaceshipOn) {
      audioController?.playSound(sounds.spaceshipOn, true, 0.02);
    }
  }

  function playHolographicDisplay() {
    if (sounds.holographicDisplay) {
      audioController?.playSound(sounds.holographicDisplay, false, 1);
    }
  }

  function playWarpSpeed() {
    if (sounds.warpSpeed) {
      audioController?.playSound(sounds.warpSpeed, false, 1.1);
    }
  }
  // handle recieving data from chlidren

  const handleImageSrcReceived = (imageSrc: string) => {
    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };

  const handleModifedPrompt = (modifiedPrompt: string) => {
    setModifiedPrompt(modifiedPrompt);

    console.log(" updateAllData(); foor modifiedPrompt");
  };
  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    setSelectedTokenId(selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    toast.success(`AI-U TOKEN IDS RECIEVED\n`);
  };

  const handleScanning = (scanning: boolean) => {
    if (scanning === true) {
    }
    setScanning(!scanning);
    console.log("SCANNING", { scanning });
    fetchTargetPlanet();
  };

  const handleEngaged = (engaged: boolean) => {
    if (engaged === true && selectedTokenId !== "") {
      console.log("WARP DRIVE IS ENGAGED", { warping, engaged });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-centermin-h-screen">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet" />
        <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-4">
          <Dashboard
            loadingProgress={loadingProgress}
            scanning={scanning}
            error={error}
            warping={warping}
            imageUrl={imageUrl || ""}
            srcUrl={srcUrl ? srcUrl : ""}
            onSubmitPrompt={submitPrompt}
            onSubmit={submitPrompt}
            handleButtonClick={handleButtonClick}
            loading={loading}
            buttonMessageId={buttonMessageId}
            travelStatus={travelStatus}
            dynamicImageUrl={backgroundImageUrl}
          >
            <SpaceshipInterface travelStatus={travelStatus} />
            <AcquiringTarget loading={loading} travelStatus={travelStatus} selectedTokenId={selectedTokenId} />

            <TokenSelectionPanel
              setEngaged={setEngaged}
              warping={warping}
              scannerOutput={metaScanData}
              playSpaceshipOn={playSpaceshipOn}
              playHolographicDisplay={playHolographicDisplay}
              playSpaceshipHum={playSpaceshipHum}
              playWarpSpeed={playWarpSpeed}
              handleScanning={handleScanning}
              scanning={scanning}
              buttonMessageId={buttonMessageId}
              handleButtonClick={handleButtonClick}
              modifiedPrompt={modifiedPrompt}
              setTravelStatus={newStatus => setTravelStatus(newStatus)}
              handleEngaged={handleEngaged}
              engaged={engaged}
              onMetadataReceived={handleMetadataReceived}
              onImageSrcReceived={handleImageSrcReceived}
              onTokenIdsReceived={handleTokenIdsReceived}
              selectedTokenId={selectedTokenId}
              onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
              onSubmit={submitPrompt}
              travelStatus={travelStatus}
            />
            <DescriptionPanel
              alienMessage={planetData}
              playHolographicDisplay={playHolographicDisplay}
              handleSubmit={submitPrompt}
              scanning={scanning}
              handleScanning={handleScanning}
              travelStatus={travelStatus}
              selectedTokenId={selectedTokenId}
              description={description}
              onDescriptionIndexChange={newDescription => setSelectedDescriptionIndex(newDescription)}
              handleDescribeClick={handleDescribeClick}
            />
            <PromptPanel
              playHolographicDisplay={playHolographicDisplay}
              scanning={scanning}
              warping={warping}
              handleEngaged={handleEngaged}
              travelStatus={travelStatus}
              engaged={engaged}
              setModifiedPrompt={newPrompt => setModifiedPrompt(newPrompt)}
              imageUrl={imageUrl}
              description={selectedDescription ? selectedDescription : "No Description"}
              srcUrl={srcUrl || ""}
              onSubmitPrompt={submitPrompt}
              onSubmit={submitPrompt}
              handleButtonClick={handleButtonClick}
              loading={loading}
              metadata={metadata}
              buttonMessageId={buttonMessageId}
            />
            <div></div>
          </Dashboard>
        </div>
      </div>
    </>
  );
}
