import type { Metadata } from "~~/types/appTypes";

const InterGalaReportDisplay = (props: {
  parsedMetadata: Metadata;
  engaged: boolean;
  selectedTokenId: string;
  travelStatus: string;
  interplanetaryStatusReport: any;
}) => {
  // ... [your state and function definitions] ...
  const { parsedMetadata, engaged, selectedTokenId, travelStatus, interplanetaryStatusReport } = props;

  return (
    <div
      className="absolute top-1/4 -mt-20 mr-10 right-0
                p-12 h-1/4 w-2/6"
    >
      <span className="text-yellow-600 text-lg">SHIP STATUS</span>
      <br />
      {selectedTokenId === "" ? (
        <> #SELECT TOKEN to DECODE#</>
      ) : (
        <>
          {travelStatus === "NoTarget" ? (
            <> #OFFLINE#</>
          ) : (
            <>
              <span className="text-green-600 text-sm"> SYSTEMS READY</span>
            </>
          )}
        </>
      )}
      {interplanetaryStatusReport === "" ? (
        <></>
      ) : (
        <>
          <span
            className="spaceship-display-screen text-center text-2xl scale-50 
                            screen-border relative mt-32 p-2 cursor-pointer hover:text-green-500"
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
