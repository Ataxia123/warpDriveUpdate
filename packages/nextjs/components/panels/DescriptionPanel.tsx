import React, { useEffect, useState } from "react";
import LogViewer from "./LogViewer";
import { useGlobalState } from "~~/services/store/store";
import type { ApiResponses, InterPlanetaryStatusReport, PlanetData } from "~~/types/appTypes";

interface StoreState {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
}

interface DescriptionPanelProps {
  alienMessage: PlanetData;
  playHolographicDisplay: () => void;
  handleClearAppState: () => void;
  handleActiveState: (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => void;

  storeState: StoreState;
  scanning: boolean;
  handleScanning: (scanning: boolean) => void;
  travelStatus: string;
  description: string[];

  onDescriptionIndexChange: (index: number) => void;
  selectedTokenId: string | null;
  handleDescribeClick: () => void;
  handleSubmit: (type: "character" | "background") => Promise<void>;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  alienMessage,
  playHolographicDisplay,
  handleClearAppState,
  handleActiveState,
  handleSubmit,
  scanning,
  handleScanning,
  travelStatus,
  description,

  handleDescribeClick,
  onDescriptionIndexChange,
  selectedTokenId,
  storeState,
}) => {
  const [focused, setFocused] = useState(false);

  const [waitingForDescription, setWaitingForDescription] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);

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
  const interplanetaryStatusReport = useGlobalState(state => state.interPlanetaryStatusReport);
  const ipsrOptions = [
    "missionId",
    "location",
    "characters",
    "objective",
    "status",
    "surroundingsDescription",
    "conflictDescription",
    "metadata",
    "narrative",
  ];

  const [count, setCount] = useState(-1);
  const index = () => {
    playHolographicDisplay();
    if (count < ipsrOptions.length - 1) {
      setCount(count + 1);
    } else {
      setCount(-1);
    }
  };
  return (
    <div
      className={`${
        focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
      }  spaceship-panel screen-border `}
      style={{
        transition: "all 0.5s ease-in-out",
        padding: "0.2rem",
        height: "50%",
        width: "23%",
        left: "70%",
        top: "30%",
      }}
      onClick={handleClick}
    >
      <img
        style={{
          top: "10%",
          position: "absolute",
          height: "80%",
          width: "100%",
          objectFit: "fill",
          left: "4%",
          padding: "5.5rem",
        }}
        src="aiu.png"
      ></img>
      <div
        className="spaceship-display-screen description-text"
        style={{
          display: "flex",
          alignContent: "center",
          flexDirection: "column",

          padding: "0.4rem",
          overflowX: "hidden",
        }}
      >
        <p
          className=""
          style={{
            scale: "2.3",
          }}
        >
          {" "}
          AI-UNIVERSE
        </p>
        <p
          style={{
            color: "white",
            scale: "1",
            marginTop: "0%",
            marginBottom: "-5%",
          }}
        >
          {" "}
          INTERGALACTIC SCANNER
        </p>
        <br />
        <>
          {interplanetaryStatusReport.missionId! && <>TARGETING SYSTEM NOT ENGAGED</>}

          {interplanetaryStatusReport.missionId ? ( //wip
            <>
              <p
                className="description-text"
                style={{
                  top: "20%",
                  position: "absolute",
                }}
              >
                {" "}
                INCOMING TRANSMISSION:
                <br />
              </p>
              <div
                className="screen-border"
                style={{
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: "45%",
                  padding: "15px",
                  paddingLeft: "3rem",
                  marginBottom: "-6rem",
                  top: "8%",
                  bottom: "20%",
                  width: "110%",
                  left: "0%",
                  justifyContent: "right",
                  scale: "1.1",
                }}
                onClick={e => {
                  e.stopPropagation();
                  index();
                }}
              >
                <span className="text-white text-2xl">{ipsrOptions[count]} </span> <br />
                <div className="text-lg pr-4">
                  {interplanetaryStatusReport &&
                    JSON.stringify(interplanetaryStatusReport[ipsrOptions[count] as keyof InterPlanetaryStatusReport])}
                </div>
                <div className="text-sm">{}</div>
                <div
                  className="hex-data"
                  style={{
                    opacity: "0.3",

                    pointerEvents: "none",
                  }}
                >
                  {JSON.stringify(interplanetaryStatusReport)}
                </div>
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                ></div>
              </div>
            </>
          ) : (
            !selectedTokenId && (
              <>
                <p>Select a transmission ID</p>
              </>
            )
          )}

          <div
            className="screen-border"
            style={{
              height: "20%",
              width: "100%",
              top: "78%",
              left: "0%",

              flexDirection: "row",
              backdropFilter: "blur(3px)",

              position: "absolute",
            }}
          >
            {travelStatus !== "NoTarget" && (
              <div
                style={{
                  fontWeight: "bold",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                }}
              >
                {" "}
                <div
                  className="spaceship-screen-display"
                  style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "row",
                    scale: "1",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {travelStatus === "AcquiringTarget" && selectedTokenId && !scanning && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {!toggle && (
                        <button
                          className={
                            "py-2 px-4 rounded font-bold  hover:bg-green-700 description-text spaceship-text screen-border"
                          }
                          style={{
                            border: "15px solid black",
                            width: "50%",
                            height: "100%",
                            margin: "0.2rem",
                            marginTop: "-1.6rem",
                            fontSize: "1.8rem",
                            fontWeight: "bold",
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            handleScanClick();
                          }}
                        >
                          {}
                          SCAN
                        </button>
                      )}
                    </div>
                  )}
                  {toggle && description && (
                    <div className="spaceship-display-screen">
                      <button
                        className={`screen-border`}
                        style={{
                          border: "15px solid black",
                          width: "50%",
                          height: "100%",
                          margin: "0.2rem",
                          marginTop: "-1.6rem",
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleButtonClick();
                        }}
                      >
                        <span
                          className="spaceship-button"
                          style={{
                            color: "white",
                            fontFamily: "Orbitron",
                            fontSize: ".8rem",
                            height: "100%",
                          }}
                        >
                          {" "}
                          SET COORDINATES
                        </span>{" "}
                      </button>
                    </div>
                  )}
                  <div
                    className="spaceship-display-screen"
                    style={{
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      scale: "1.2",
                      left: "55%",
                      bottom: "23%",
                      width: "43%",
                      height: "100%",
                    }}
                  >
                    <p
                      style={{
                        color: "white",
                        marginBottom: "0rem",
                        top: "-20%",
                        bottom: "25%",
                      }}
                    >
                      {" "}
                      - STATUS -
                    </p>
                    SCANNING: {scanning ? "ON" : "OFF"}
                    <br />
                    <br />
                    {travelStatus === "TargetAcquired" ? (
                      <>|COORDINATES SET|</>
                    ) : description.length > 0 ? (
                      <>COMPUTING COORDINATES</>
                    ) : (
                      <>SETTING COODRINATES</>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className={"spaceship-display-screen"}>{travelStatus === "NoTarget" && <>NO TARGETS AVAILABLE</>}</div>
          </div>
        </>
      </div>
    </div>
  );
};

export default DescriptionPanel;
