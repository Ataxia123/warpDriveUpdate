// index.tsx
import { useCallback, useEffect, useState } from "react";
import AudioController from "../components/AudioController";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import { useGlobalState as useAppStore, useImageStore } from "../services/store/store";
import axios from "axios";
import { ethers } from "ethers";
import GraphemeSplitter from "grapheme-splitter";
import { toast } from "react-hot-toast";
import { useAccount, useContractEvent, useContractRead, usePublicClient } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import type {
  ApiResponses,
  ChatData,
  InterPlanetaryStatusReport,
  MetaScanData,
  MidjourneyConfig,
  NftData,
  PlanetData,
  ProgressResponseType,
  Response,
  Sounds,
  StoreState,
} from "~~/types/appTypes";
import { generatePrompt } from "~~/utils/nerdUtils";
import { useEthersProvider } from "~~/utils/wagmi-utils";

export default function Home() {
  const [appState, setAppState] = useState({
    loading: false,
    loadingProgress: 0,
    originatingMessageId: "",
    error: "",
    waitingForWebhook: false,
    description: [],
    selectedDescriptionIndex: 0,
    selectedTokenId: "",
    buttonMessageId: "",
    backgroundImageUrl: "assets/background.png",
    travelStatus: "NoTarget",
    prevTravelStatus: "",
    selectedDescription: "",
    modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE",
    warping: false,
    scanning: false,
    preExtraText: "",
    AfterExtraText: "",
  });
  const {
    loadingProgress,
    loading,
    prevTravelStatus,
    error,
    waitingForWebhook,
    description,
    selectedTokenId,
    buttonMessageId,
    backgroundImageUrl,
    travelStatus,
    modifiedPrompt,
    warping,
    scanning,
  } = appState;
  //session storage
  const [storeState, setStoreState] = useState<StoreState>({
    interplanetaryStatusReports: [],
    scanningResults: [],
    imagesStored: [],
  });

  const { address } = useAccount();
  const { data: transferEvents } = useScaffoldEventHistory({
    contractName: "WarpDrive",
    eventName: "Transfer",
    fromBlock: BigInt(15795907), // Set an appropriate starting block number
    filters: { to: address },
  });

  // Outside of the component

  const { data: deployedContract } = useDeployedContractInfo("WarpDrive");

  const provider = useEthersProvider();
  const createEthersContract = () => {
    return deployedContract ? new ethers.Contract(deployedContract.address, deployedContract.abi, provider) : null;
  };
  const contractInstance = createEthersContract();

  const imgStore = useImageStore(state => state);
  const {
    setSrcUrl,
    setImageUrl,
    imageUrl,
    setBackgroundImageUrl,
    setdisplayImageUrl: setDisplayImageUrl,
    resetImages,
  } = imgStore;

  const tokenIds = useAppStore(state => state.tokenIds);
  const reset = useAppStore(state => state.reset);
  const setTravels = useAppStore(state => state.setTravels);
  const setMetadata = useAppStore(state => state.setApiResponses);
  const setNftData = useAppStore(state => state.setNftData);
  const setPlanetData = useAppStore(state => state.setPlanetData);
  const setMetaScanData = useAppStore(state => state.setMetaScanData);
  const setTokenIds = useAppStore(state => state.setTokenIds);
  const setInterplanetaryStatusReport = useAppStore(state => state.setInterPlanetaryStatusReport);
  const midjourneyConfig = useAppStore(state => state.midjourneyConfig);
  const metaScanData = useAppStore(state => state.metaScanData);
  const interplanetaryStatusReport = useAppStore(state => state.interPlanetaryStatusReport);
  const planetData = useAppStore(state => state.planetData);
  const nftData = useAppStore(state => state.nftData);
  const setMidJourneyConfig = useAppStore(state => state.setMidjourneyConfig);
  const travels = useAppStore(state => state.travels);
  const [sounds, setSounds] = useState<Sounds>({});
  const [audioController, setAudioController] = useState<AudioController | null>(null);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [tokenURI, setTokenURI] = useState<string>();
  const updateState = (key: string, value: any) => {
    setAppState(prevState => ({ ...prevState, [key]: value }));
  };

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

  const updateAppState = (userBalance: bigint, ownedTokenIds: string[]) => {
    setBalance(userBalance);
    setTokenIds(ownedTokenIds);
  };

  const resetAppState = () => {
    reset();
    resetImages();
  };
  const fetchMetadata = async () => {
    if (!tokenURI) return;

    try {
      const response = await fetch(tokenURI);
      const json = await response.json();

      console.log("NFT DATA", json);
      handleMetadataReceived(json);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const fetchTokenURI = async () => {
    if (!address || !deployedContract || !selectedTokenId) return;
    resetAppState();
    try {
      if (!contractInstance) return;

      const uri = await contractInstance.tokenURI(selectedTokenId);
      setTokenURI(uri);
      console.log(uri);
    } catch (error) {
      console.error("Error fetching token URI:", error);
    }
  };

  const fetchTokenIds = async () => {
    if (!address || !deployedContract) {
      console.log("No address or deployed contract");
      resetAppState();
      return;
    }
    if (!contractInstance) return;

    try {
      const userBalance = await fetchUserBalance(address, contractInstance);
      const ownedTokenIds = fetchOwnedTokenIds(transferEvents);

      userBalance >= BigInt(0) ? updateAppState(userBalance, ownedTokenIds) : resetAppState();
      console.log("tokenIds", ownedTokenIds, "userBalance", userBalance);
    } catch (error) {
      console.error("Error in fetchTokenIds:", error);
      resetAppState();
    }
  };

  const handleMetadataReceived = (metadata: any) => {
    console.log("Metadata received in the parent component:", metadata);
    // Extract the attributes from the metadata
    const attributes = metadata.attributes.reduce((acc: any, attr: any) => {
      acc[attr.trait_type] = attr.value;
      return acc;
    }, {});
    const ipfsGateway = "https://ipfs.io"; // Choose a gateway
    const imageUrl = metadata.image?.replace("ipfs://", `${ipfsGateway}/ipfs/`);
    setImageUrl(imageUrl);
    const nftQuery = {
      Level: attributes.Level,
      Power1: attributes["Power 1"],
      Power2: attributes["Power 2"],
      Power3: attributes["Power 3"],
      Power4: attributes["Power 4"],
      Alignment1: attributes["Alignment 1"],
      Alignment2: attributes["Alignment 2"],
      Side: attributes.Side,
    };
    setNftData(nftQuery);
    generateMetadata(nftQuery);
    toast.success(`
                INCOMING TRANSMISSION\n
            Established connection with:\n
            ${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2}\n
            Agent #${selectedTokenId} of the A.I.U.
           `);
  };

  useEffect(() => {
    fetchMetadata();
  }, [tokenURI]);
  useEffect(() => {
    fetchTokenURI();
  }, [address, selectedTokenId]);
  // Inside your component
  useEffect(() => {
    fetchTokenIds();
  }, [address, deployedContract, transferEvents]);

  useEffect(() => {
    updateState("prevTravelStatus", travelStatus);
    console.log("prevTravelStatus", prevTravelStatus);
    if (travelStatus === "NoTarget" && prevTravelStatus === "TargetAcquired") {
      // setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
      createTravelResult();
      console.log("GENERATED TRAVEL OUTPUT:", travels[1]);
    }
  }, [travelStatus]);

  const bMessageId = buttonMessageId;

  const { url: srcUrl, nijiFlag, selectedDescription, vFlag } = midjourneyConfig || {};

  const metadata: ApiResponses = {
    interPlanetaryStatusReport: interplanetaryStatusReport,
    nftData,
    metaScanData,
    planetData,
    chatData: {} as ChatData,
    midjourneyConfig,
    imageData: {} as Response,
  };

  let count: number;
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

  function createTravelResult() {
    // Collect all the required information for the travel result

    return;
  }

  const handleActiveSate = (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => {
    setAppState(prevState => ({
      ...prevState,
      imageUrl: imageUrl,
      selectedDescription: selectedDescription,
      interplanetaryStatusReport: interplanetaryStatusReport,
    }));
  };

  const handleClearAppState = () => {
    reset();
    resetImages();
  };

  const generateMetadata = async (n: NftData) => {
    if (isNaN(count)) {
      count = 0;
      await fetchScanningReport(n)
        .then(async e => {
          count++;
          toast.success(
            `
                    AGENT LOCATION: ${JSON.stringify(e.currentLocation)}\n
                    Current Mission Brief: ${JSON.stringify(e.currentMissionBrief)}\n
                    RESULT SENT TO BACKEND"`,
          );
          await fetchTargetPlanet(e).then(async r => {
            count++;
            toast.success(`PLANET ID: ${r.planetId}\n
                                           LocationName: ${r.Scan.locationName}\n
                                           EnvScan: ${r.Scan.environmental_analysis}`);
            await fetchInterplanetaryStatusReport(r);
          });
        })
        .catch((err: any) => {
          console.log("ERROR", err);
          return (count = NaN);
        });
    } else {
      toast.error("fetching error");
      console.log("count", count, selectedTokenId);
      return;
    }
  };

  // TRAVEL HANDLER
  const fetchScanningReport = async (nftQuery: NftData) => {
    try {
      const response = await axios.post("/api/scanning_result", {
        metadata: nftQuery,
      });
      updateState("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
      console.log("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
      const r = JSON.parse(response.data.scannerOutput.rawOutput);
      setMetaScanData(r);
      return r;
    } catch (error) {
      console.error("Error fetching scanning report:", error);
    }
  };

  const fetchInterplanetaryStatusReport = async (s: PlanetData) => {
    try {
      const response = await axios.post("/api/generate_report", {
        metaScanData,
        nftData,
        planetData: s,
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

  const fetchTargetPlanet = async (r: MetaScanData) => {
    try {
      const response = await axios.post("/api/alienEncoder", {
        metaScanData: r,
        nftData: nftData,
      });
      const s = JSON.parse(response.data.alienMessage);
      setPlanetData(s);
      return s;

      console.log("fetchTargetPlanet", s);
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
    updateState("waitingForWebhook", true);
    updateState("warping", true);
    console.log("WARP DRIVE IS CHARACTER IN ENGAGED", { warping, prompt });

    if (modifiedPrompt !== "ALLIANCE OF THE INFINITE UNIVERSE" && type === "character") {
      prompt = modifiedPrompt;
    }

    try {
      const r = await axios.post("/api/apiHandler", {
        prompt,
      });

      console.log("response", r);
      updateState("response", r.data.response);
      // Set the appropriate state based on the type
      if (type === "character") {
        updateState("imageUrl", r.data.response.imageUrl);

        setImageUrl(r.data.response.imageUrl);
        updateState("buttonMessageId", r.data.buttonMessageId);
      } else {
        setBackgroundImageUrl(backgroundImageUrl);
        updateState("buttonMessageId", r.data.buttonMessageId);
      }
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);
    }
    if (type === "character") {
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("loadingProgress", "COMPLETE");
    } else if (travelStatus === "AcquiringTarget") {
      updateState("loadingProgress", "TRAVELING");
    }
    updateState("waitingForWebhook", false);
    updateState("warping", false);
    updateState("travelStatus", "NoTarget");
    updateState("scanning", false);
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
    updateState("waitingForWebhook", true);
    if (type === "background") {
      console.log("buttonMessageId", buttonMessageId);
      updateState("travelStatus", "TargetAcquired");
      updateState("warping", true);
    } else if (travelStatus === "AcquiringTarget") {
      console.log("buttonMessageId", buttonMessageId);
      updateState("travelStatus", "TargetAcquired");
      updateState("warping", true);
    }

    try {
      console.log("button", button, bMessageId);
      const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId: bMessageId });

      console.log("response", r);
      updateState("response", JSON.stringify(r, null, 2));

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
          if (progressData.progress === 100) {
            buttonCommandResponse = progressData;
            imageUrl = progressData.response.imageUrl;
            buttonId = progressData.response.buttonMessageId;
          } else if (progressData.progress === "incomplete") {
            // Handle error case
            console.error("Error: Task is incomplete");
            break;
          } else {
            // Update loading state with progressData.progress
            console.log("Progress:", progressData.progress, progressData.response.buttonMessageId);
            updateState("buttonMessageId", buttonId);
            updateState("loading", progressData.progress);

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
        updateState("tempUrl", imageUrl);
        setDisplayImageUrl(imageUrl ? imageUrl : "");
      } else if (type === "background") {
        updateState("backgroundImageUrl", imageUrl);
        updateState("imageUrl", imageUrl);
      }

      updateState("travelStatus", "NoTarget");

      console.log("Button Command Response:", buttonCommandResponse);
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);
      updateState("waitingForWebhook", false);
    }
    updateState("warping", false);
    updateState("scanning", false);
    updateState("waitingForWebhook", false);
    updateState("travelStatus", "NoTarget");
    setBackgroundImageUrl(imageUrl);

    updateState("loadingProgress", 0);
    // handleDescribeClick();
  };

  // handle recieving data from chlidren

  const handleImageSrcReceived = (imageSrc: string) => {
    console.log(srcUrl);
    // Handle the imageSrc here, e.g., update the state or call another function
  };

  const handleModifedPrompt = (modifiedPrompt: Partial<ApiResponses>) => {
    updateState("modifiedPrompt", modifiedPrompt);

    console.log(" updateAllData(); foor modifiedPrompt");
  };
  const handleSelectedTokenIdRecieved = (selectedTokenId: string) => {
    updateState("selectedTokenId", selectedTokenId);
  };
  const handleTokenIdsReceived = (tokenIds: string[]) => {
    // Handle the token IDs here, e.g., update the state or call another function
  };

  const handleScanning = (scanning: boolean) => {
    updateState("scanning", scanning);
    console.log("SCANNING", { scanning });

    return console.log("Tried to Upscale new background but", { travelStatus, scanning });
  };

  const handleEngaged = (engaged: boolean) => {
    if (engaged === true) {
      console.log("WARP DRIVE IS ENGAGED", { warping, engaged });
    }
  };

  const handleDescribeClick = async () => {
    console.log(
      `Submitting image URL: ${scanning && backgroundImageUrl ? backgroundImageUrl : imageUrl ? imageUrl : srcUrl}`,
    );
    updateState("loading", true);

    if (waitingForWebhook) {
      console.log("Already waiting for webhook, please wait for response.");
      return;
    }

    updateState("waitingForWebhook", true);

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

      updateState("description", cleanedDescription);
      updateState("selectedDescription", cleanedDescription[0]);
    } catch (e: any) {
      console.log(e);
      updateState("error", e.message);
      updateState("warping", false);
      updateState("travelStatus", "NoTarget");
      updateState("scanning", false);

      updateState("loading", false);
    }
    updateState("waitingForWebhook", false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-centermin-h-screen">
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet" />
        <div className="container mx-auto h-screen flex flex-col items-center justify-center space-y-8">
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
              setTravelStatus={newStatus => updateState("travelStatus", newStatus)}
              handleEngaged={handleEngaged}
              engaged={warping}
              onMetadataReceived={handleMetadataReceived}
              onImageSrcReceived={handleImageSrcReceived}
              onTokenIdsReceived={handleTokenIdsReceived}
              onSelectedTokenIdRecieved={handleSelectedTokenIdRecieved}
              onSubmit={submitPrompt}
              travelStatus={travelStatus}
            />
            <DescriptionPanel
              alienMessage={planetData}
              playHolographicDisplay={playHolographicDisplay}
              handleClearAppState={handleClearAppState}
              handleActiveState={handleActiveSate}
              storeState={storeState}
              handleSubmit={submitPrompt}
              scanning={scanning}
              handleScanning={handleScanning}
              travelStatus={travelStatus}
              selectedTokenId={selectedTokenId}
              description={description}
              onDescriptionIndexChange={newDescription => updateState("setSelectedDescription", newDescription)}
              handleDescribeClick={handleDescribeClick}
            />
            <PromptPanel
              playHolographicDisplay={playHolographicDisplay}
              scanning={scanning}
              warping={warping}
              handleEngaged={handleEngaged}
              travelStatus={travelStatus}
              engaged={warping}
              setModifiedPrompt={handleModifedPrompt}
              imageUrl={imageUrl}
              description={selectedDescription ? selectedDescription : "No Description"}
              srcUrl={srcUrl || ""}
              onSubmitPrompt={submitPrompt}
              onSubmit={submitPrompt}
              handleButtonClick={handleButtonClick}
              loading={loading}
              metadata={metadata}
              buttonMessageId={buttonMessageId}
              generatePrompt={generatePrompt}
            />
            <div></div>
          </Dashboard>
        </div>
      </div>
    </>
  );
}
