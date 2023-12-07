import Image from "next/image";
import { useGlobalState } from "~~/services/store/store";
import type { ApiResponses } from "~~/types/appTypes";

const InterGalaReportDisplay = (props: {
  metadata: ApiResponses;
  engaged: boolean;
  selectedTokenId: string;
  travelStatus: string;
  setEngaged: (engaged: boolean) => void;
}) => {
  // ... [your state and function definitions] ...
  const { metadata, engaged, selectedTokenId, setEngaged, travelStatus } = props;
  const parsedMetadata = metadata?.nftData ? metadata.nftData : null;
  const account = useGlobalState(state => state.account);
  return (
    <div
      className="spaceship-display-screen absolute  text-center left-1/2 -ml-[4.8%] p-1 w-1/2 bottom-1/3 -mb-[3.1%]"
      style={{
        width: "10%",
        height: "12%",
      }}
    >
      <img
        className="absolute p-10 opacity-25 hover:opacity-40 cursor-pointer -translate-y-6"
        src="/aiu.png"
        onClick={() => {
          setEngaged(!engaged);
        }}
      />
      ||--AI-U--|| <br />
      <span className="text-green-600 text-xs"> SIGNAL FOUND:</span>
      {selectedTokenId === "" ? (
        <>
          WELCOME COMMANDER
          <br />
          <span className="text-2xl text-white">{account?.displayName}</span>
        </>
      ) : (
        <>
          {travelStatus === "NoTarget" ? (
            <>
              <span className="text-yellow-600 text-lg">
                {" "}
                SIGNAL_ID <br />
                <span className="text-2xl text-white">#AIU{selectedTokenId}</span>
              </span>
            </>
          ) : (
            <>
              <span className="text-green-600 text-sm">READY FOR HYPERSPACE</span>
            </>
          )}
        </>
      )}
      {!parsedMetadata ? (
        <></>
      ) : (
        <>
          <span
            className="spaceship-display-screen text-center text-2xl scale-y-50 
                            screen-border relative mt-6 ml-1 cursor-pointer hover:text-green-500"
          >
            <br />
            TRANSMISSION FROM:
            <br />
            {parsedMetadata?.Level} {parsedMetadata?.Power1} {parsedMetadata?.Power2}
          </span>
          <br />
        </>
      )}
    </div>
  );
};

export default InterGalaReportDisplay;
