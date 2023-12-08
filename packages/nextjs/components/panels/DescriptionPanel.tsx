import React, { useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import type { InterPlanetaryStatusReport, PlanetData } from "~~/types/appTypes";

interface DescriptionPanelProps {
  alienMessage: PlanetData;
  playHolographicDisplay: () => void;
  handleActiveState: (imageUrl: string, selectedDescription: string, interplanetaryStatusReport: string) => void;

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
  handleSubmit,
  scanning,
  handleScanning,
  travelStatus,
  description,
  handleDescribeClick,
  selectedTokenId,
}) => {
  const [focused, setFocused] = useState(true);

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
  const ipr = useGlobalState(state => state.interPlanetaryStatusReport);
  const planetData = useGlobalState(state => state.planetData);
  const metaScan = useGlobalState(state => state.metaScanData);
  const nftData = useGlobalState(state => state.nftData);
  const heroName = JSON.stringify(
    `${nftData.Level} ${nftData.Power1} ${nftData.Power2} ${nftData.Power3} ${nftData.Power3}`,
  ).replace(/undefined/g, "");
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

  const [count, setCount] = useState(0);
  const index = () => {
    playHolographicDisplay();
    if (count < ipsrOptions.length - 1) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  };
  return (
    <div
      className={`${
        focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
      }  spaceship-panel screen-border`}
      style={{
        transition: "all 0.5s ease-in-out",
        padding: "0.4rem",
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
          left: "8%",
          padding: "5.5rem",
        }}
        src="aiu.png"
      ></img>
      <div className="spaceship-display-screen description-text flex-col-center p-2 pl-5" style={{}}>
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
            marginTop: "-2%",
            marginBottom: "-5%",
          }}
        >
          INTERGALACTIC SCANNER
        </p>
        <br />
        <>
          <div className="absolute text-left h-full w-full top-[12%] description-text">
            <div
              className="screen-border relative  cursor-pointer"
              style={{
                height: "50%",
                paddingLeft: "3rem",
                top: "2%",
                bottom: "20%",
                width: "100%",
                left: "0%",
                justifyContent: "left",
                scale: "1.1",
              }}
              onClick={e => {
                e.stopPropagation();
                index();
              }}
            >
              <>
                {heroName.length > 10 && (
                  <span className=" relative -left-[12%] text-sm">
                    TRANSMISSION FROM <br /> <span className="text-sm text-white">{heroName}</span>
                  </span>
                )}

                <span className="text-left text-sm relative top-[0%] -left-[12%] overflow-y-auto overflow-x-hidden p-2">
                  MISSION CHECKLIST
                  <li className={`${!planetData.planetId ? "text-red-500" : "text-green-500"}`}>
                    PLANET COORDINATES
                    <br />
                  </li>
                  <li className={`${!metaScan.currentLocation?.x ? "text-red-500" : "text-green-500"}`}>
                    AI-U AGENT STATUS
                    <br />
                  </li>
                  <li className={`${ipr.missionId !== "" ? "text-red-500" : "text-green-500"}`}>
                    INTER-PLANETARY STATUS
                    <br />
                  </li>
                  <li className={`${travelStatus !== "TargetAcquired" ? "text-red-500" : "text-green-500"}`}>
                    WARP READY
                    <br />
                  </li>
                  <li className={`${ipr.missionId !== "" ? "text-red-500" : "text-green-500"}`}>
                    AI-U BROADCAST
                    <br />
                  </li>
                </span>

                <ul className="w-[90%] text-left text-sm relative top-[0%] -left-[8%] overflow-y-auto overflow-x-hidden p-2">
                  <span className="relative text-white font-bold">{ipsrOptions[count]} </span> <br />
                  <li className="relative text-lg pr-4 description-text ">
                    {ipr && JSON.stringify(ipr[ipsrOptions[count] as keyof InterPlanetaryStatusReport])}
                  </li>
                </ul>
                <div
                  className="hex-data"
                  style={{
                    opacity: "0.3",

                    pointerEvents: "none",
                  }}
                >
                  {JSON.stringify(ipr)}
                </div>
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                ></div>
              </>
            </div>
          </div>
          {selectedTokenId && (
            <div className="relative top-1/2 mt-6 flex-col h-[10%]">
              {!toggle && (
                <button
                  className={
                    " w-full rounded font-bold hover:bg-green-700 description-text spaceship-text screen-border"
                  }
                  onClick={e => {
                    e.stopPropagation();
                    handleScanClick();
                  }}
                >
                  SCAN
                </button>
              )}
              {toggle && description && (
                <button
                  className={`screen-border w-[50%] h-[90%] mt-3`}
                  style={{
                    border: "5px solid black",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  <span
                    className="spaceship-text"
                    style={{
                      color: "white",
                      fontFamily: "Orbitron",
                      fontSize: ".8rem",
                    }}
                  >
                    {" "}
                    SET COORDINATES
                  </span>{" "}
                </button>
              )}
            </div>
          )}{" "}
          <div
            className="screen-border p-5 pt-0"
            style={{
              height: "15%",
              width: "100%",
              top: "82%",
              left: "0%",

              flexDirection: "row",
              backdropFilter: "blur(3px)",

              position: "absolute",
            }}
          >
            {!selectedTokenId && <span>Select a transmission ID</span>}- SCANNER - {scanning ? "ON" : "OFF"}
            <div
              style={{
                fontWeight: "bold",
                position: "relative",
                height: "100%",
                width: "100%",
              }}
            >
              <div
                className="absolute spaceship-display-screen"
                style={{
                  top: "0%",
                  left: "0%",
                  width: "100%",
                  height: "65%",
                }}
              >
                COORDINATES
                <br />
                <ul className="relative text-white text-xs -top-1">
                  {travelStatus !== "NoTarget" ? (
                    <>|Computing...|</>
                  ) : (
                    alienMessage.locationCoordinates?.x && (
                      <li>
                        X:{alienMessage?.locationCoordinates.x} Y:{alienMessage?.locationCoordinates.y} Z:
                        {alienMessage?.locationCoordinates.z}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default DescriptionPanel;
