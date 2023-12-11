import Image from "next/image";
import { useGlobalState } from "~~/services/store/store";
import type { ApiResponses } from "~~/types/appTypes";

const InterGalaReportDisplay = () => {
  // ... [your state and function definitions] ...
  const selectedTokenId = 2;
  const parsedMetadata = null;
  const account = useGlobalState(state => state.account);
  //const pilotData = { account, nickname, occupation, guild };
  return (
    <>
      <div
        className="spaceship-display-screen absolute text-lg overflow-hidden text-center rounded-full"
        style={{
          width: "90%",
          height: "80%",
          top: "20%",
        }}
      >
        <img
          className="absolute p-9 -left-0.5 ml-1.5 -mt-1.5 opacity-5 hover:opacity-30 cursor-pointer -translate-y-6"
          src="/aiu.png"
        />
        <p className="relative top-[5%] pointer-events-none">
          <span className="relative text-2xl font-black bottom-4">||-----AI-U-----|| </span>

          <br />
          <>
            <>
              <div className="hex-prompt p-2 text-center">
                <label>
                  Nickname
                  <input className="hex-prompt ml-3" />
                </label>
                <br />
                <label>
                  Ocupation
                  <input className="hex-prompt ml-1" />
                </label>
                <br />
                <label>
                  Guild
                  <input className="hex-prompt ml-12" />
                </label>
                <br />

                <span className="relative left-1/3 text-yellow-600 text-sm text-left">
                  <span className="text-md font-bold">
                    <li>
                      CMDR:
                      <span className="text-lg text-white"> {account?.displayName}</span>{" "}
                    </li>
                  </span>{" "}
                  <li>
                    SIGNAL_ID: <span className="text-white">{selectedTokenId ? selectedTokenId : "|---|"}</span>
                  </li>
                  <li> Location:</li>
                </span>
              </div>
            </>
          </>

          {!parsedMetadata ? <></> : <></>}
        </p>
      </div>
    </>
  );
};

export default InterGalaReportDisplay;
