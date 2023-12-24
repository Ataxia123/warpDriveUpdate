"use client"
// index.tsx
import { useCallback, useEffect, useState } from "react";
import AudioController from "../components/AudioController";
import Dashboard from "../components/Dashboard";
import AcquiringTarget from "../components/panels/AcquiringTarget";
import DescriptionPanel from "../components/panels/DescriptionPanel";
import PromptPanel from "../components/panels/PromptPanel";
import SpaceshipInterface from "../components/panels/SpaceshipInterface";
import TokenSelectionPanel from "../components/panels/TokenSelectionPanel";
import { useQuipuxStore, useAppStore, useEncoder, useGlobalState, useImageStore } from "../services/store/store";
import axios from "axios";
import { ethers } from "ethers";
import GraphemeSplitter from "grapheme-splitter";
import { toast } from "react-hot-toast";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAccount, useBlockNumber } from "wagmi";

import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";


import type {
    ApiResponses,
    ChatData,
    HeroCodex,
    NftData,
    PilotState,
    PlanetData,
    ProgressResponseType,
    QuestData,
    Response,
    ShipState,
    Sounds,
} from "~~/types/appTypes";
import { generatePrompt } from "~~/utils/nerdUtils";
import { useProvider, useSigner } from "../utils/wagmi-utils";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth/useScaffoldEventHistory";
import { useFetchNFT, getHeroCodex } from "~~/hooks/useAIU";
import { UseScaffoldEventHistoryData } from "~~/utils/scaffold-eth/contract";





export default function Home() {
    const { refetch: refetchBn, data: blockNumber } = useBlockNumber();
    const quipux = useQuipuxStore(state => state);
    const encoder = useEncoder(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);

    const provider = useProvider();
    const signer = useSigner();
    const account = useAccount();

    const address = account.address;    // WEB3 STUFF
    const fetchUserPilot = async () => {
        // Initialize the sdk with the address of the EAS Schema contract address
        console.log("account.address", account.address, address);

        try {
            const response = await fetch("http://0.0.0.0:3000/aiu/userPilot", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ address })
            }); // assume the same host
            ;
            const json = await response.json();
            /*if (json.myPilot[0] == undefined) {
                store.setMyData(json);
                store.setMyPilots(json.myPilot);
                return console.log("no pilot data");
            }*/
            console.log(json, "Player data from DB");
            store.setMyPilots(json.myPilot);
            store.setMyData(json);
        } catch (e: any) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        if (!account.address || account.address === "") return console.log("noAddy", account.address);
        fetchUserPilot();
    }, [address, quipux.database]);

    useEffect(() => {
        quipux.setCredentials({ provider, signer, account });
        console.log("credentials", quipux.credentials);
    }, [account.address]);



    // Gets a default provider (in production use something else like infura/alchemy)

    // Connects an ethers style provider/signingProvider to perform read/write functions.
    // MUST be a signer to do write operations!
    // Initialize the sdk with the Provider



    const imgStore = useImageStore(state => state);
    const [sounds, setSounds] = useState<Sounds>({});
    const [audioController, setAudioController] = useState<AudioController | null>(null);
    const [toggle, setToggle] = useState(false);
    const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);
    const intakeForm = useGlobalState(state => state.intakeForm);
    const setIntakeForm = useGlobalState(state => state.setIntakeForm);

    const db = useQuipuxStore(state => state.database);


    //session storage
    //STATE STUFF
    const {
        setImageUrl,
        imageUrl,
        setBackgroundImageUrl,
        setDisplayImageUrl,
        resetImages,
    } = imgStore;

    const {
        setNftData,
        setTokenIds,
        setMidjourneyConfig,
        midjourneyConfig,
        engaged,
        setEngaged,
        selectedTokenId,
        setSelectedTokenId,
        description,
        setDescription,
        buttonMessageId,
        setButtonMessageId,
        nftData,
        travels,
        modifiedPrompt,
        setModifiedPrompt,
        setSelectedDescription,
        selectedDescriptionIndex,
        setSelectedDescriptionIndex,
        originatingMessageId,
        setOriginatingMessageId,
        setApiResponses,
    } = useGlobalState(state => ({
        setNftData: state.setNftData,
        setTokenIds: state.setTokenIds,
        setMidjourneyConfig: state.setMidjourneyConfig,
        midjourneyConfig: state.midjourneyConfig,
        engaged: state.engaged,
        originatingMessageId: state.originatingMessageId,
        setOriginatingMessageId: state.setOriginatingMessageId,
        description: state.description,
        setDescription: state.setDescription,
        selectedDescriptionIndex: state.selectedDescriptionIndex,
        setSelectedDescriptionIndex: state.setSelectedDescriptionIndex,
        selectedTokenId: state.selectedTokenId,
        setSelectedTokenId: state.setSelectedTokenId,
        buttonMessageId: state.buttonMessageId,
        setButtonMessageId: state.setButtonMessageId,
        selectedDescription: state.selectedDescription,
        setSelectedDescription: state.setSelectedDescription,
        modifiedPrompt: state.modifiedPrompt,
        setModifiedPrompt: state.setModifiedPrompt,
        setEngaged: state.setEngaged,
        nftData: state.nftData,
        travels: state.travels,
        setApiResponses: state.setApiResponses,
    }));
    const {
        loading,
        setloading,
        loadingProgress,
        setloadingProgress,
        error,
        setError,
        waitingForWebhook,
        setWaitingForWebhook,
        travelStatus,
        setTravelStatus,
        prevTravelStatus,
        setPrevTravelStatus,
        warping,
        setWarping,
        scanning,
        setScanning,
    } = useAppStore(state => ({
        loading: state.loading,
        setloading: state.setloading,
        loadingProgress: state.loadingProgress,
        setloadingProgress: state.setloadingProgress,
        error: state.error,
        setError: state.setError,
        waitingForWebhook: state.waitingForWebhook,
        setWaitingForWebhook: state.setWaitingForWebhook,
        travelStatus: state.travelStatus,
        setTravelStatus: state.setTravelStatus,
        prevTravelStatus: state.prevTravelStatus,
        setPrevTravelStatus: state.setPrevTravelStatus,
        warping: state.warping,
        setWarping: state.setWarping,
        scanning: state.scanning,
        setScanning: state.setScanning,
    }));

    const metadata: ApiResponses = {
        midjourneyConfig,
        nftData,
        questData: {} as QuestData,
        metaScanData: {} as HeroCodex,
        planetData: {} as PlanetData,
        chatData: {} as ChatData,
        imageData: {} as Response,
        shipState: {} as ShipState,
        pilotData: {} as PilotState,
    };
    //
    const { data: transferEvents, isLoading } = useScaffoldEventHistory({
        contractName: "WarpDrive",
        eventName: "Transfer",
        fromBlock: BigInt(15795907), // Set an appropriate starting block number
    });

    const { url: srcUrl, nijiFlag, selectedDescription, vFlag } = midjourneyConfig || {};

    const handleImageSrcReceived = (imageSrc: string) => {
        console.log(srcUrl);
        // Handle the imageSrc here, e.g., update the state or call another function
    };

    const getRandomTokenId = (transferEvents: any[]) => {
        if (!transferEvents || transferEvents.length === 0) return null;
        const tokenIds = transferEvents.map(event => Number(event.args.tokenId));
        const maxTokenId = Math.max(...tokenIds);
        return Math.floor(Math.random() * (maxTokenId + 1));
    };


    const handleTokenIdsReceived = (tokenIds: string[]) => {
        toast.success(`AI-U TOKEN IDS RECIEVED\n`);
    };

    const handleScanning = (scanning: boolean) => {
        if (scanning === true) {
        }
        setScanning(!scanning);
        console.log("SCANNING", { scanning });
    };

    const handleEngaged = (engaged: boolean) => {
        if (engaged === true && selectedTokenId !== "") {
            console.log("WARP DRIVE IS ENGAGED", { warping, engaged });
        }
    };

    useEffect(() => {
        if (!travelStatus) return console.log("no travel status");
        setPrevTravelStatus(travelStatus);
        console.log("prevTravelStatus", prevTravelStatus);
        if (prevTravelStatus === ""
            && travelStatus === "AcquiringTarget") {
            toast.success("getting IPAR")
        }
        if (travelStatus === "NoTarget"
            && prevTravelStatus
            === "TargetAcquired") {
            // setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
            console.log("GENERATED TRAVEL OUTPUT:", travels[1]);
        }
    }, [travelStatus]);


    const fetchNFT = async (tokenId: string) => {
        setSelectedTokenId(tokenId);
        console.log(app.contractInstance)
        if (app.contractInstance) {

            const contract = new ethers.Contract(app.contractInstance.address, app.contractInstance.abi, provider);
            const uri = await contract.tokenURI(tokenId);
            const nftQuery = await useFetchNFT(tokenId, uri);
            if (!nftQuery) return console.log("no nftQuery", nftQuery, uri, tokenId)

            const capName = nftQuery.nftQuery.Level + " " +
                (nftQuery.nftQuery.Power1 || '')
                + " " + (nftQuery.nftQuery.Power2 || '')
                + " " + (nftQuery.nftQuery.Power3 || '')
                + " " + (nftQuery.nftQuery.Power4 || '');
            let codex = store.myData.myHeroCodex.find((value: { id: string }) => value.id === tokenId);
            let query: Partial<NftData> = nftQuery.nftQuery;
            query.capName = capName;

            console.log("heroCodex", codex, query);
            //setActiveCodex(codex);
            setNftData(query as NftData);
            setImageUrl(nftQuery.imageUrl);


            if (!codex) {
                console.log("NO TOKEN ID FOUND", tokenId);
                codex = await getHeroCodex(nftQuery, capName)

                const heroCodex = codex

                console.log("heroCodex", heroCodex);

                setDisplayImageUrl(codex.pons?.ship.image);

            }


        }

        console.log("why am i here?");
    }

    useEffect(() => {
        if (transferEvents && transferEvents.length > 0 && !isLoading) {
            const randomId = getRandomTokenId(transferEvents);
            if (!randomId || selectedTokenId !== "") return;
            fetchNFT(randomId.toString());

            app.setTransferEvents(transferEvents);
            console.log("fetchTokenIds", randomId);
        }
    }, [address, transferEvents]);


    // BUSINESS END
    //
    const attestMission = async (mission: QuestData) => {


        if (app.provider! || app.signer!) return;
        quipux.eas.connect(app.provider);
        const offchain = await quipux.eas.getOffchain();

        //

        const encodedData = encoder.missionEncoder.encodeData([
            { name: "reportId", value: app.blockNumber + store.selectedTokenId, type: "string" },
            { name: "locationCoordinates", value: [], type: "uint64[]" },
            { name: "captainId", value: BigInt(store.selectedTokenId), type: "uint16" },
            { name: "description", value: mission.descriptiveText, type: "string" },
            { name: "bounty", value: "0", type: "uint64" },
        ]);



        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: app.account.address ? app.account.address : "0x0000000000000000",
                expirationTime: BigInt(0),
                time: app.blockNumber ? app.blockNumber : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: encoder.missionUID,
                data: encodedData,
            },
            app.signer,
        )





        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;


    }




    const handleSendMessage = async (nftData: HeroCodex) => {
        playHolographicDisplay();
        try {
            const response = await fetch("/api/generate_report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nftData),
            });
            const rawResponse = await response.json();

            console.log("rawResponse", rawResponse);

            const r = JSON.parse(rawResponse)

            console.log(r);
            try {
                attestMission(r.missionReport as QuestData)
                quipux.setQuestData(r.missionReport as QuestData);

                //attestPilot(r);
                //attestShip(r.shipData);


            } catch {
                console.log("Error attesting pilot or ship")

            }



            console.log("rawResponse", rawResponse, intakeForm, r);

        } catch (error) {
            console.error("Error sending message:", error);
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
        handleSendMessage(quipux.metaScanData);
        let prompt = "A view from a spaceship that just left hyperspace into:" + " " + " " + "System"


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
                    if (progressData.progress !== 0 && progressData.response.imageUrl) {
                        const messageId = progressData.response.buttonMessageId;
                        setButtonMessageId(messageId || "");
                        console.log(buttonMessageId);
                    }
                    if (progressData.progress === 100) {
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
                    };
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
            console.log("button", button, buttonMessageId);
            const r = await axios.post("/api/postButtonCommand", { button, buttonMessageId });

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
                            setBackgroundImageUrl(progressData.response.imageUrl);

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
        setWarping(false);
        setTravelStatus("NoTarget");
        setScanning(false);
        console.log(imgStore);

        setloadingProgress(0);
        //sendDatatoDB({ image, nftData, metaScanDta, planetData })
        // // generate planet image with dall-e
    };
    const handleDescribeClick = async () => {
        console.log(
            `Submitting image URL: 
            ${scanning && imgStore.backgroundImageUrl
                ? imgStore.backgroundImageUrl
                : imageUrl
                    ? imageUrl
                    : srcUrl}`,
        );
        setloading(true);

        if (waitingForWebhook) {
            console.log("Already waiting for webhook, please wait for response.");
            return;
        }
        setWaitingForWebhook(true);

        const url = scanning && imgStore.backgroundImageUrl ? imgStore.backgroundImageUrl : imageUrl ? imageUrl : srcUrl;
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
                        dynamicImageUrl={imgStore.backgroundImageUrl}
                    >
                        <SpaceshipInterface travelStatus={travelStatus} />
                        <AcquiringTarget loading={loading} travelStatus={travelStatus} selectedTokenId={selectedTokenId} />

                        <TokenSelectionPanel
                            setEngaged={setEngaged}
                            warping={warping}
                            scannerOutput={quipux.metaScanData}
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
                            onImageSrcReceived={handleImageSrcReceived}
                            onTokenIdsReceived={handleTokenIdsReceived}
                            selectedTokenId={selectedTokenId}
                            onSelectedTokenIdRecieved={fetchNFT}
                            onSubmit={submitPrompt}
                            travelStatus={travelStatus}
                        />
                        <DescriptionPanel
                            alienMessage={quipux.planetData}
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
                            srcUrl={srcUrl}
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
















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































