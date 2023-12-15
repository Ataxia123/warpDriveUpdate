import { useQuipuxStore, useImageStore, useEncoder, useGlobalState, useAppStore } from "~~/services/store/store";
import axios from "axios";
import { toast } from "react-hot-toast";
import type { NftData, QuestData, MetaScanData, PilotState, ShipState, PlanetData, Location, Item, Stats } from "~~/types/appTypes";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
const quipux = useQuipuxStore.getState();
const state = useGlobalState.getState();
const encoder = useEncoder.getState();
const app = useAppStore.getState();
const imgStore = useImageStore.getState();



export const useFetchScanningReport = async (nftQuery: NftData) => {
    try {
        const response = await axios.post("/api/scanning_result", {
            metadata: nftQuery,
        });
        console.log("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
        const r = JSON.parse(response.data.scannerOutput.rawOutput);
        quipux.setMetaScanData(r);
        quipux.routeLog.push(r.currentLocation)
        quipux.setLocation(r.currentLocation);
        toast.success(
            `
                        AGENT LOCATION: ${JSON.stringify(r.currentLocation)}\n
                        Current Mission Brief: ${JSON.stringify(r.currentMissionBrief)}\n
                        RESULT SENT TO BACKEND"`,
        );
        console.log(r, "missionData");
        return r;
    } catch (error) {
        console.error("Error fetching scanning report:", error);
    }
};

export const fetchInterplanetaryStatusReport = async () => {
    try {
        const response = await axios.post("/api/generate_report", {
        });

        const t = JSON.parse(response.data.report);

        quipux.setQuestData(t);

        toast.success(`AI-U IPS Report Recieved\n
                            MissionId: ${response.data.report.missionId}
                            objective:${t.objective}
                            Mission Data: ${JSON.stringify(t.metadata)}`);
        return t;
    } catch (error) {
        console.error("Error fetching interplanetary status report:", error);
    }
};




export const fetchUserBalance = async (address: string, contract: any) => {
    if (!address || !contract) return BigInt(0);
    try {
        return await contract.balanceOf(address);
    } catch (error) {
        console.error("Error fetching user balance:", error);
        return BigInt(0);
    }
};
export const fetchNFT = async (tokenId: string) => {
    if (!app.account.address || !tokenId) return console.log("one of the params is missing");
    try {
        if (!app.contractInstance) return;
        const uri = await app.contractInstance.tokenURI(tokenId);
        const response = await fetch(uri);
        const json = await response.json();
        app.setTokenURI(json);
        console.log(uri, json);
    } catch (error) {
        console.error("Error fetching token URI:", error);
    }
};

const useMetadata = (metadata: any) => {
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
        nftId: state.selectedTokenId,
        Level: attributes?.Level,
        Power1: attributes["Power 1"],
        Power2: attributes["Power 2"],
        Power3: attributes["Power 3"],
        Power4: attributes["Power 4"],
        Alignment1: attributes["Alignment 1"],
        Alignment2: attributes["Alignment 2"],
        Side: attributes.Side,
    };

    state.setNftData(nftQuery);

    toast.success(`
                INCOMING TRANSMISSION\n
            Established connection with:\n
            ${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2}\n
            Agent #${state.selectedTokenId} of the A.I.U.
           `);

    imgStore.setImageUrl(imageUrl);
    state.setMidjourneyConfig({ url: imageUrl });
};

// BUSINESS END
// generate text--> attest +  generateImage -> send to backend


export const handleSendMessage = async () => {
    try {
        const response = await fetch("/api/newPilot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state.intakeForm),
        });
        const rawResponse = await response.json();

        console.log("rawResponse", rawResponse);

        const r = JSON.parse(rawResponse.pilotData);

        quipux.setLocation(r.currentLocation);
        quipux.routeLog.push(r.currentLocation);
        quipux.setPilotData(r.pilotData);
        quipux.setShipData(r.shipData);


        console.log("rawResponse", rawResponse, state.intakeForm, r);

    } catch (error) {
        console.error("Error sending message:", error);
    }
};

export const registerHero = async (captainData: MetaScanData, pilotAttestation: any, uid: string) => {
    // Save only if player id does not exist
    //
    console.log("pilotData", captainData, pilotAttestation);

    try {
        await axios.post("http://0.0.0.0:3000/aiu/captainLog",
            {
                headers: {
                    "Content-Type": "application/json"
                },
                body: { captainData, pilotAttestation, uid, address: "" }
            })
        toast.success("Captain Attested")
    } catch (error) {
        console.error("Error sending message:", error);
    }
}



// Signer must be an ethers-like signer.

export const attestShip = async (shipData: any) => {

    try {
        const response = await fetch("/api/newShip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shipData),
        });

        const rawResponse = await response.json();

        console.log("ShipRaw", rawResponse);


        imgStore.setImageUrl(rawResponse.image)
        console.log("shipData", rawResponse, shipData)
    } catch {
        console.log("Error attesting ship")
    }
}


export const attestHero = async (hero: MetaScanData) => {


    if (!app.provider || !app.signer) return;
    quipux.eas.connect(app.provider);
    const offchain = await quipux.eas.getOffchain();

    //

    const encodedData = encoder.missionEncoder.encodeData([
        { name: "reportId", value: app.blockNumber + state.selectedTokenId, type: "string" },
        { name: "locationCoordinates", value: [], type: "uint64[]" },
        { name: "captainId", value: BigInt(state.selectedTokenId), type: "uint16" },
        { name: "description", value: "", type: "string" },
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

