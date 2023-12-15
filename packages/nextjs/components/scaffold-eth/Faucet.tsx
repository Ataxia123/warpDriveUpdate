import { useEffect, useState } from "react";
import ChatWithCaptain from "../../components/panels/ChatWithCaptain";
import SwitchBoard from "../../components/panels/Switchboard";
import { useNetwork } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import IntergalacticReportDisplay from "~~/components/IntergalacticReportDisplay";
import LogViewer from "~~/components/panels/LogViewer";
import { useAppStore, useGlobalState, useImageStore } from "~~/services/store/store";
import type { ApiResponses, MetaScanData } from "~~/types/appTypes";

export const Faucet = (props: {
    handleScanning: (scanning: boolean) => void;
    metadata: ApiResponses;
    engaged: boolean;
    selectedTokenId: string;
    travelStatus: string | undefined;
    playHolographicDisplay: () => void;
    setEngaged: (engaged: boolean) => void;
    scannerOutput: MetaScanData;
    scannerOptions: any;
}) => {
    const {
        handleScanning,
        metadata,
        engaged,
        selectedTokenId,
        playHolographicDisplay,
        travelStatus,
        setEngaged,
        scannerOutput,
        scannerOptions,
    } = props;
    const globalState = useGlobalState(state => state);
    const imageState = useImageStore(state => state);
    const appState = useAppStore(state => state);
    const dataClass = ["logData", "imageData", "SwitchBoard"];
    const [index, setDataIndex] = useState(0);
    const newIndex = 0;

    const handleIndex = (change: number) => {
        {
            /*newIndex = index + change;
              if (index >= dataClass.length) {
                  newIndex = 0; // Wrap around to the beginning
              } else if (newIndex < 0) {
                  newIndex = dataClass.length - 1; // Wrap around to the end
              }*/
        }
        setDataIndex(change);
    };
    const renderCustomInterface = () => {
        switch (dataClass[index]) {
            case "imageData":
                // Custom interface for image data
                return (
                    <>

                        <LogViewer
                            playHolographicDisplay={playHolographicDisplay}
                            scannerOutput={scannerOutput}
                            scannerOptions={scannerOptions}
                        />
                    </>
                );
            case "logData":
                // Custom interface for interplanetary status report
                return <IntergalacticReportDisplay playHolographicDisplay={playHolographicDisplay} />;
            case "SwitchBoard":
                // Custom interface for meta scan data
                return <SwitchBoard />;
            case "imageData":
                // Custom interface for ship state
                return <SwitchBoard />;
            case "imageData":
                // Custom interface for chat data
                return <SwitchBoard />;
            case "imageData":
                // Custom interface for pilot data
                return <SwitchBoard />;
            default:
                // Default interface if no specific one is found
                return <SwitchBoard />;
        }
    };

    const CustomInterface = () => {
        return renderCustomInterface();
    };

    return (
        <div className="z-10 fixed h-[12%] w-[10%] top-[60%] left-[45.2%]">
            <label
                htmlFor="faucet-modal"
                className="absolute spaceship-display-screen hex-prompt  text-center cursor-pointer hover:opacity-50 font-normal normal-case gap-1"
            >
                <div className="relative text-lg text-white top-2 font-bold">N.A.V.I. Interface
                    <br />
                    <div className="relative hex-prompt text-xl"><br />id: {globalState.account?.displayName}</div></div>
            </label>
            <input type="checkbox" id="faucet-modal" className="modal-toggle" onClick={() => handleScanning(true)} />

            <label
                htmlFor="faucet-modal"
                className="modal rounded-full cursor-pointer relative z-[20000000] -left-[177%] -top-[425%] h-[600%] w-[450%]"
                style={{ transform: "perspective(100px) rotateX(1deg)" }}
            >
                <label
                    htmlFor="faucet-modal"
                    className="screen border btn btn-ghost btn-sm btn-circle absolute z-5 right-3 top-3"
                >
                    {" "}
                    ✕
                </label>

                <label className="modal-box h-[75%] w-[100%] overflow-hidden">
                    {/* dummy input to capture event onclick on modal box */}
                    <input className="h-0 w-0 absolute top-0 left-0 spaceship-display-screen" />

                    <div className="flex flex-col absolute spaceship-display-screen space-x-4 screen-border">
                        <span className="relative text-2xl top-5 font-bold">N.A.V.I. Interface</span>
                        <img className="absolute  opacity-60 -z-10 h-[10%] w-[10%] top-3 left-[43%]" src="/aiu.png" />

                        <div className="flex flex-row items-center justify-between w-full p-5 text-sm pl-6 cursor-pointer">
                            <span
                                onClick={() => {
                                    playHolographicDisplay();
                                    handleIndex(0);
                                }}
                                className="hover:text-bold hover:text-white"
                            >
                                DATA EXPORER
                            </span>
                            <span
                                onClick={() => {
                                    playHolographicDisplay();
                                    handleIndex(1);
                                }}
                                className="hover:text-bold hover:text-white"
                            >
                                PILOT PAGE
                            </span>
                            <span
                                onClick={() => {
                                    playHolographicDisplay();
                                    handleIndex(2);
                                }}
                                className="hover:text-bold hover:text-white"
                            >
                                AIU-LINK
                            </span>
                            <span
                                onClick={() => {
                                    playHolographicDisplay();
                                    handleIndex(4);
                                }}
                                className="hover:text-bold hover:text-white"
                            >
                                CONFIG
                            </span>
                        </div>
                        <CustomInterface />
                    </div>
                </label>
            </label>
        </div>
    );
};
