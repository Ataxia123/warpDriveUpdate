import React, { useEffect, useState } from "react";
import ChatWithCaptain from "./ChatWithCaptain";
import { useGlobalState, useImageStore } from "~~/services/store/store";
import type { InterPlanetaryStatusReport, PlanetData, ToggleOptions } from "~~/types/appTypes";
import { generatePrompt, stringToHex } from "~~/utils/nerdUtils";

interface DescriptionPanelProps {
  alienMessage: PlanetData;
  playHolographicDisplay: () => void;

  scanning: boolean;
  handleScanning: (scanning: boolean) => void;
  travelStatus: string | undefined;
  description: string[];

  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | null;
  handleDescribeClick: () => void;
  handleSubmit: (type: "character" | "background") => Promise<void>;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  alienMessage,
  playHolographicDisplay,
  handleSubmit,
  scanning,
  handleScanning,
  travelStatus,
  description,
  handleDescribeClick,
  selectedTokenId,
}) => {
  const [focused, setFocused] = useState(false);

  const [toggle, setToggle] = useState<boolean>(false);

  const imageState = useImageStore(state => state);
  const handleClick = () => {
    playHolographicDisplay();
    setFocused(!focused);
  };

  const handleScanClick = () => {
    playHolographicDisplay();

    setToggle(!toggle);
    handleDescribeClick();
  };

  const handleButtonClick = () => {
    playHolographicDisplay();
    handleScanning(true);
    handleSubmit("background");
    setToggle(!toggle);
  };

  const planetData = useGlobalState(state => state.planetData);
  const metaScan = useGlobalState(state => state.metaScanData);
  const state = useGlobalState(state => state);
  const nftData = useGlobalState(state => state.nftData);
  const chatData = useGlobalState(state => state.chatData);
  const setChatData = useGlobalState(state => state.setChatData);
  const heroName = JSON.stringify(
    `${nftData.Level} ${nftData.Power1} ${nftData.Power2} ${nftData.Power3} ${nftData.Power3}`,
  ).replace(/undefined/g, "");

  const [modifiedPrompt, setModifiedPrompt] = useState("ALLIANCEOFTHEINFINITEUNIVERSE");

  // set string state to be either "character" or "background enforcing type
  const [type, setType] = useState<"character" | "background">("character");
  const [nijiFlag, setNijiFlag] = useState<boolean>(false);
  const [vFlag, setVFlag] = useState<boolean>(false);
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [toggleOptions, setToggleOptions] = useState<ToggleOptions>({});

  const switchBoardButtons = ["Niji", "V5", "Background", "DESC", "URL", "CLEAR"];

  const renderCheckbox = (label: string, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => (
    <label>
      {label}
      <input
        type="checkbox"
        checked={state}
        onChange={e => {
          e.stopPropagation();
          setState(e.target.checked);
        }}
      />
    </label>
  );
  const generateModifiedPrompt = () => {
    const promptType = scanning ? "background" : "character";

    // Use the toggleOptions to filter the promptData
    //const newPrompt = response.replace(/undefined/g, "");
    // Generate the prompt using the filtered data
    // Update the modifiedPrompt state
    //setModifiedPrompt(newPrompt);
  };

  const [count, setCount] = useState(0);
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  const handleUserMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    playHolographicDisplay();
    try {
      const response = await fetch("/api/chatWithCaptain", {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
        },
        body: JSON.stringify({ userMessage, userSelection: chatData.userSelection, chatHistory: chatLog }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let captainResponse = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const partialResponse = decoder.decode(value, { stream: true });
          captainResponse += partialResponse;
          setChatLog([captainResponse]);
          // Scroll to the bottom of the chat log container
        }
        chatData.naviMessages?.push(captainResponse);
        setUserMessage(userMessage);
        // Update global state here if necessary
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    const chatContainer = document.getElementById(".chat-log-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatLog]); // Dependency array includes chatLog, so this runs when chatLog changes

  // Helper function to convert a string to a hex string

  return (
    <>
      -ENCODE SIGNAL-
      <div
        className={`${
          focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
        }  spaceship-panel screen-border`}
        style={{
          transition: "all 0.5s ease-in-out",
          padding: "0.4rem",
          height: "40%",
          width: "23%",
          left: "70%",
          top: "40%",
        }}
        onClick={handleClick}
      >
        <div
          className="absolute screen-border p-5 pt-0 "
          style={{
            height: "100%",
            width: "100%",
            top: "0%",
            left: "0%",

            flexDirection: "row",
            backdropFilter: "blur(3px)",

            position: "absolute",
          }}
        >
          <ul>
            <li className="text-3xl text-white font-bold p-5">N.A.V.I. COMMS</li>
          </ul>
          <div
            onClick={e => {
              e.stopPropagation();
            }}
            className="absolute spaceship-display-screen"
            style={{
              left: "-1%",
            }}
          >
            <>
              <p className="description-text" style={{ color: "white" }}>
                {" "}
                ||||||||||||AI-UNIVERSE SIGNAL ENCODER||||||||||||||
              </p>

              <div className="relative  ">
                <div
                  style={{
                    height: "50%",
                    color: "white",
                  }}
                >
                  <div className="fixed p-6 m-2 top-10 left-0 overflow-y-auto h-1/3 " id=".chat-log-container">
                    <span>USER MESSAGE: {modifiedPrompt}</span>
                    <br />

                    {chatLog.map(item => (
                      <span key={item} className="">
                        NAVI: {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="toggles-container flex flex-wrap p-1 pl-12"
                style={{
                  border: "1px solid",
                  alignContent: "center",

                  width: "100%",
                  backgroundColor: "black",
                  top: "50%",
                  position: "absolute",
                }}
              >
                <label>
                  Talk to NAVI
                  <input
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    onChange={e => {
                      e.stopPropagation();
                      handleUserMessageChange(e);
                    }}
                    onSubmit={e => {
                      e.stopPropagation();
                    }}
                    type="text"
                    className="hex-prompt ml-5"
                    value={userMessage}
                    placeholder="Type your message..."
                  />
                </label>

                <br />
                <label>
                  AIU-SCAN
                  <input
                    className="hex-prompt ml-10"
                    type="text"
                    value={displayPrompt}
                    placeholder="Viewfinder Request..."
                    onChange={e => {
                      e.stopPropagation();
                      playHolographicDisplay();
                      setDisplayPrompt(e.target.value);
                    }}
                  />
                </label>

                <div className="relative flex-row space-x-3 -space-y-2 text-xs cursor-pointer">
                  <br />
                  <button
                    className="hex-prompt p-2"
                    onClick={() => {
                      playHolographicDisplay();
                      handleSendMessage();
                    }}
                  >
                    <span
                      className=""
                      style={{
                        color: "white",
                      }}
                    >
                      Send Message
                    </span>
                  </button>

                  <button
                    className="hex-prompt p-1.5"
                    onClick={e => {
                      e.stopPropagation();
                      handleScanClick();
                    }}
                  >
                    SCAN
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleButtonClick();
                    }}
                  >
                    <span className="hex-prompt p-1.5"> SET TARGET</span>{" "}
                  </button>
                  <button
                    className="hex-prompt p-1.5"
                    onClick={e => {
                      {
                        generateModifiedPrompt();
                        playHolographicDisplay();
                        //onModifiedPrompt(displayPrompt || "");
                      }
                      e.stopPropagation();
                    }}
                  >
                    Submit
                  </button>
                </div>
                <li>
                  {!selectedTokenId && <span>Select a transmission ID</span>}:
                  {selectedTokenId && <>TokenId:{selectedTokenId}</>}
                </li>

                {travelStatus !== "NoTarget" ? (
                  <>|Computing...|</>
                ) : (
                  alienMessage?.locationCoordinates?.x && (
                    <li>
                      X:{alienMessage?.locationCoordinates.x} Y:{alienMessage?.locationCoordinates.y} Z:
                      {alienMessage?.locationCoordinates.z}
                    </li>
                  )
                )}

                <li> SCANNER - {scanning ? "ON" : "OFF"}</li>

                {renderCheckbox("nijiFlag", nijiFlag, setNijiFlag)}
                {renderCheckbox("vFlag", vFlag, setVFlag)}
              </div>

              <div className="hex-data">
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
                {stringToHex(modifiedPrompt)}
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default DescriptionPanel;
