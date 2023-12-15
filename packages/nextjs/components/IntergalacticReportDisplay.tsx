import React, { useState } from "react";
import { useGlobalState, useAppStore, useQuipuxStore, useImageStore } from "~~/services/store/store";
import { EncounterResultData, PilotState, ShipState } from '~~/types/appTypes';
import { MongoClient } from 'mongodb'
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useBlockNumber } from "wagmi";
import { useProvider, useSigner } from "~~/utils/wagmi-utils";
import axios from "axios";
import toast from "react-hot-toast";



const InterGalaReportDisplay = (props: { playHolographicDisplay: () => void }) => {

    // Database Name
    const imageStore = useImageStore(state => state);


    const { data: blockNumber, isError, isLoading } = useBlockNumber();

    // Initialize the sdk with the address of the EAS Schema contract address

    // Gets a default provider (in production use something else like infura/alchemy)
    //eas.connect(provider);

    // Initialize the sdk with the Provider

    // ... [your state and function definitions] ...
    const { playHolographicDisplay } = props;
    const selectedTokenId = 2;
    const parsedMetadata = null;
    const account = useAppStore(state => state.account);

    const address = account?.address;
    const signer = useSigner();
    //const pilotData = { account, nickname, occupation, guild };
    //

    const [answer, setAnswer] = useState("");
    const [nickname, setNickname] = useState("");
    const [occupation, setOccupation] = useState("");
    const [guild, setGuild] = useState("");
    const quipux = useQuipuxStore(state => state);
    const intakeForm = { account: account?.address, nickname, occupation, guild, answer };
    // Use connect method to connect to the server
    // Access to 'players' collection
    //
    // Initialize the sdk with the address of the EAS Schema contract address

    // Gets a default provider (in production use something else like infura/alchemy)

    // Initialize the sdk with the Provider


    const handleSendMessage = async () => {
        playHolographicDisplay();
        try {
            const response = await fetch("/api/newPilot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(intakeForm),
            });
            const rawResponse = await response.json();


            const r = JSON.parse(rawResponse.pilotData);

            console.log("rawResponse", rawResponse, r);
            quipux.setPilotData(r.pilotData)
            quipux.setShipData(r.shipData)
            quipux.setLocation(r.locationData);
            quipux.routeLog.push(r.locationData);

            try {
                requestShip(r.shipData)

                attestPilot(r.pilotData)


            } catch {
                console.log("Error attesting pilot or ship")

            }



            console.log("rawResponse", rawResponse, intakeForm, r);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    async function registerPilot(pilotData: PilotState, pilotAttestation: any, uid: string) {
        // Save only if player id does not exist
        //
        console.log("pilotData", pilotData, pilotAttestation);

        try {
            await axios.post("http://0.0.0.0:3000/aiu/attest",
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { pilotData, pilotAttestation, uid, address }
                })
            toast.success("Pilot Attested")
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    const provider = useProvider();
    const easContractAddress = "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587";
    const schemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.




    const attestPilot = async (pilot: PilotState) => {


        if (!provider || !signer) return;
        eas.connect(provider);
        const offchain = await eas.getOffchain();

        //

        // Initialize SchemaEncoder with the schema string
        const pilotSchemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
        const pilotSchemaEncoder = new SchemaEncoder("string pilotName,string pilotDescription,address alignment,uint64 credits,uint64[] location");
        const pilotEncodedData = pilotSchemaEncoder.encodeData([
            { name: "pilotName", value: "", type: "string" },
            { name: "pilotDescription", value: "", type: "string" },
            { name: "alignment", value: "0x0000000000000000000000000000000000000000", type: "address" },
            { name: "credits", value: BigInt(0), type: "uint64" },
            {
                name: "location", value: [BigInt(0),
                BigInt(0), BigInt(0)], type: "uint64[]"
            },
        ]);



        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address ? address : "0x0000000000000000",
                expirationTime: BigInt(0),
                time: blockNumber ? blockNumber : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: pilotSchemaUID,
                data: pilotEncodedData,
            },
            signer,
        )





        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;


        registerPilot(pilot, updatedData, uid)
    }

    const attestShip = async (pilot: ShipState) => {


        if (!provider || !signer) return;
        eas.connect(provider);
        const offchain = await eas.getOffchain();

        //

        // Initialize SchemaEncoder with the schema string
        const pilotSchemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
        const pilotSchemaEncoder = new SchemaEncoder("string pilotName,string pilotDescription,address alignment,uint64 credits,uint64[] location");
        const pilotEncodedData = pilotSchemaEncoder.encodeData([
            { name: "pilotName", value: "", type: "string" },
            { name: "pilotDescription", value: "", type: "string" },
            { name: "alignment", value: "0x0000000000000000000000000000000000000000", type: "address" },
            { name: "credits", value: BigInt(0), type: "uint64" },
            {
                name: "location", value: [BigInt(0),
                BigInt(0), BigInt(0)], type: "uint64[]"
            },
        ]);



        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address ? address : "0x0000000000000000",
                expirationTime: BigInt(0),
                time: blockNumber ? blockNumber : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: pilotSchemaUID,
                data: pilotEncodedData,
            },
            signer,
        )





        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;


        // registerShip(pilot, updatedData, uid)
    }


    const requestShip = async (shipData: ShipState) => {

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


            imageStore.setImageUrl(rawResponse.image)
            console.log("shipData", rawResponse, shipData)
        } catch {
            console.log("Error attesting ship")
        }
    }

    const generateShip = async (pilotData: ShipState) => {
        const response = await fetch("/api/newShip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pilotData),
        });

        const rawResponse = await response.json();
        console.log("ShipRaw", rawResponse);

        const r = JSON.parse(rawResponse.pilotData);

        quipux.setShipData(r.shipData)
        try {
            requestShip(r.shipData)
            attestShip(r.shipData)
        }
        catch {
            console.log("Error setting ship data")

        }


    }



    return (
        <>
            <div
                className="spaceship-display-screen absolute text-lg  text-center rounded-full"
                style={{
                    width: "90%",
                    height: "60%",
                    top: "16%",
                }}
            >
                <img
                    className="absolute p-9 -left-0.5 ml-1.5 -mt-1.5 opacity-5 pointer-events-none -translate-y-6 -z-2"
                    src="/aiu.png"
                />
                <div className="relative top-[5%]">
                    <span className="relative text-2xl font-black bottom-4">||-----AI-U-----|| </span>

                    <br />
                    <>
                        <div className="hex-prompt p-2 text-center space-y-1">

                            {!quipux.pilotData.pilotName ? (
                                <form className="space-y-2 p-1">
                                    <span className="relative  text-yellow-600 pointer-events-auto cursor-pointer"> AIU-001
                                        <br /> <span className="text-lg font-bold text-left">
                                            CMDR:
                                            <span className="text-2xl text-white"> {account?.displayName}</span>{" "}
                                        </span>{" "}
                                    </span>



                                    <label>
                                        Nickname
                                        <input className="hex-prompt ml-3 m-1"
                                            onChange={e => {
                                                playHolographicDisplay();
                                                setNickname(e.target.value)
                                            }}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Ocupation
                                        <input className="hex-prompt ml-1 m-1"
                                            onChange={e => {
                                                playHolographicDisplay();
                                                setOccupation(e.target.value)
                                            }}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Guild
                                        <input className="hex-prompt ml-12 m-1"
                                            onChange={e => {
                                                playHolographicDisplay();
                                                setGuild(e.target.value)
                                            }}

                                        />
                                    </label><br />
                                    <span className="text-white">What is the meaning of life?</span><br />
                                    <label>
                                        Answer
                                        <input className="hex-prompt ml-10 m-1"


                                            onChange={e => {
                                                playHolographicDisplay();
                                                setAnswer(e.target.value)
                                            }}
                                        />
                                    </label><br />
                                    <button
                                        className="spaceship-display-screen hex-prompt mt-5 p-2"


                                        onClick={(e) => { e.preventDefault(); handleSendMessage() }}
                                    >submit
                                    </button>
                                </form>) : (
                                <>
                                    <span className="text-white">CMDR
                                    </span>
                                    <span className="text-2xl">  {quipux.pilotData.pilotName}#{quipux.pilotData.pilotId}<br /></span>

                                    <strong className="text-white text-md">{quipux.pilotData.guildName}<br /></strong>



                                    CREDITS: 0
                                    <div className=" flex flex-row relative text-left text-sm hex-prompt p-5 h-[100%] w-[100%] ">


                                        <div className="flex flex-col">
                                            NAV:{quipux.location && Object.entries(quipux.location).map(([key, value], index) => (
                                                <ul key={index}>
                                                    <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
                                                    </li>
                                                </ul >
                                            ))}
                                        </div>



                                        <ul>


                                            <strong className="text-white text-md"> ID:{quipux.shipData.shipId}<br /></strong>

                                            <strong className="text-white text-md"> ID:{quipux.shipData.shipId}<br /></strong>
                                            STATS{quipux.shipData.stats && Object.entries(quipux.shipData?.stats).map(([key, value], index) => (
                                                <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
                                                </li>
                                            ))}
                                            CARGO:
                                            {quipux.shipData.cargo && Object.entries(quipux.shipData.cargo).map((cargo: any, index: number) => (
                                                <li key={cargo} className="text-bold">{JSON.stringify(cargo)}:<span className="text-white"></span></li>))}
                                        </ul>





                                        <br />
                                        <div className="spaceship-display-screen absolute top-[100%] -left-1 p-1"

                                            style={{ width: "100%", height: "25%" }}>
                                            <li>{quipux.shipData.currentStatus}</li>
                                            <li>{quipux.shipData.funFact}</li>
                                        </div>
                                    </div>
                                </>)}<br />

                        </div>
                    </>

                    {!parsedMetadata ? <></> : <></>}
                </div>
            </div>
        </>
    );
};

export default InterGalaReportDisplay;
