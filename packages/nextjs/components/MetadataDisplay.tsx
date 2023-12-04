import { useState } from "react";
import type { Metadata } from "~~/types/appTypes";

const MetadataDisplay = (props: { parsedMetadata: Metadata; scannerOutput: any; scannerOptions: string[] }) => {
  // ... [your state and function definitions] ...
  const { parsedMetadata, scannerOutput, scannerOptions } = props;
  const [count, setCount] = useState(0);

  const index = () => {
    if (count < scannerOptions.length - 1) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  };

  return (
    <div className="relative left-7 top-1/4 -mt-9 h-1/5 w-1/3 p-3 text-right">
      <ul className="screen-border -top-12 pb-[2rem] mt-[-1.2rem] ml-5 pl-4  text-sm overflow-auto">
        <li className="text-green-500 text-lg p-1">METADATA</li>
        <li className="text-white font-bold p-3">
          {parsedMetadata?.Level} {parsedMetadata?.Power1} {parsedMetadata?.Power2} {parsedMetadata?.Power3}{" "}
        </li>
        <li>
          Alliance:
          <br />
          <span className="text-white font-bold p-3">{parsedMetadata?.Side}</span>
        </li>
        Alignment:
        <li>
          <span className="text-white font-bold p-2">
            {parsedMetadata?.Alignment1} {parsedMetadata?.Alignment2}
          </span>
        </li>
      </ul>
      <div
        className="relative spaceship-display-screen top-36 left-4 p-2 pr-3 overflow-y-scroll"
        onClick={() => index()}
      >
        {scannerOutput?.funFact ? (
          <div className="overflow-auto cursor-pointer">
            <span className="text-white text-2xl">{scannerOptions[count]} </span> <br />
            <div className="text-sm">{scannerOutput[scannerOptions[count]]}</div>
          </div>
        ) : (
          <>
            <span className="">
              ENGAGE N.A.V. COMPUTER TO DECODE DATA
              <br />
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default MetadataDisplay;

{
  /* 

                                                       <br />
                        </div>
                    </div>
                </div>
                <div className="hex-data z-[-11111]">
                    <div className="spaceship-display-screen absolute top-[17%] left-[68.2%] h-[85%] w-[35%] flex flex-col justify-center items-center pointer-events-auto">
                        <div className="hex-prompt display-border mt-[7%] ml-[-1rem] p-[1rem] pr-[3.2rem] h-[90%] w-[90%] text-[0.8rem] pointer-events-auto overflow-y-scroll">
                            <span className="spaceship-display-screen absolute top-[1.5rem] w-[60%] left-[1.4rem] text-[0.85rem] pointer-events-auto h-[18%] leading-[0.8rem]">
                                SCANNER OUTPUT: <br />
                                {scanOutputIndex + 1}/{scannerOptions.length}
                                <br />
                            </span>
                            <div className="absolute top-[15%] text-[0.9rem] pointer-events-auto spaceship-display-screen  w-[85%] pt-[.5rem] pl-0 pr-0 left-0 leading-[0.8rem]  h-[66%] flex p-[0.5rem] overflow-y-scroll flex-col text-white">
                                <button onClick={() => handlePrevious()}> {`<<`} </button> ||
                                <button
                                    onClick={() => {
                                        handleNext();
                                        console.log("I'm Clicked");
                                    }}
                                >{`>>`}</button>
                            </div>
                            <span className="hex-prompt relative">{scannerOptions[scanOutputIndex]}:</span>
                            <br />
                            <span className="hex-prompt relative top-[0.7rem]">
                                {scannerOutput[scannerOptions[scanOutputIndex]]}
                            </span>
                        </div>{" "}
                    </div>
                </div>
                {stringToHex(metadata ? metadata.description : "No Metadata")}
            </div>
       <div className="text-black relative opacity-100 h-full w-full overflow-hidden">
                       <div className="spaceship-display-screen absolute h-[40%] w-full top-[20%] left-0 flex flex-row">
                <div className="spaceship-display-screen relative bottom-[-60%] top-[-3%] left-[29%] h-full w-[70%] flex pt-[11rem] pr-[4rem] mr-0 ml-[-1rem] pointer-events-auto">
                    <div className="text-white p-[1.2rem] z-[10000000000000000000] absolute font-bold text-[1rem] h-[82%] top-[20%] w-[73.8%] left-[-2%]">
                        INTERPLANETARY STATUS REPORT
                        <div className="spaceship-display-screen text-black pl-[3.1rem] z-[10000000000000000000] relative font-bold text-[1.1rem] h-[95%] overflow-x-hidden overflow-y-scroll">
                            <div>
                                {engaged === false ? (
                                    <> #---ENGAGE to ANALYZE---#</>
                                ) : (
                                    <>
                                        {selectedTokenId === "" ? (
                                            <> #SELECT TOKEN to DECODE#</>
                                        ) : (
                                            <>
                                                {travelStatus === "NoTarget" ? (
                                                    <> #ENABLE N.A.V. COMPUTER#</>
                                                ) : (
                                                    <>
                                                        {interplanetaryStatusReport === "" ? (
                                                            <>
                                                                |------ENGAGE SCANNER------|
                                                                <br />
                                                                |----------TO OBTAIN-----------|
                                                                <br />| -INTERPLANETARY REPORT-|
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="spaceship-display-screen relative ml-[-5%] left-[17%] bottom-[-10%]">
                                                                    <br />
                                                                    TRANSMISSION FROM:
                                                                    <br />
                                                                    <br />
                                                                    {parsedMetadata?.Level} {parsedMetadata?.Power1} {parsedMetadata?.Power2}
                                                                </span>
                                                                <br />
                                                                <span className="spaceship-display-screen description-text relative top-[2.5rem] ml-[-5%] left-[-7%] mr-[10rem] animate-none text-white">
                                                                    {parsedMetadata.interplanetaryStatusReport}
                                                                </span>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                <br />
                                <br />
                                <br />
                            </div>

                            <p className="prompt-data relative text-[0.8rem] font-normal text-white justify-center items-center flex flex-col top-[0.3rem] p-[1rem] left-[-10.2%] h-full w-[110%] pointer-events-auto">
                                {" "}
                            </p>
                            {scannerOutput?.funFact ? (
                                <span className="spaceship-display-screen relative top-[1rem] left-[-0.3rem] w-[110%] h-[110%] pl-0 pr-[.8rem] text-[0.7rem] font-bold text-white pt-0">
                                    <br /> FUN FACT: <br />
                                    <br />
                                    {scannerOutput.funFact}
                                </span>
                            ) : (
                                <span className="spaceship-display-screen absolute ml-[26%] w-[40%] mr-[22%] h-0 top-0 pl-[1.2rem] mb-[20%] text-[0.8rem] font-normal">
                                    ENGAGE N.A.V. COMPUTER TO DECODE DATA
                                    <br />
                                </span>
                            )}
                            <br />
                        </div>
                    </div>
                </div>
                <div className="hex-data z-[-11111]">
                    <div className="spaceship-display-screen absolute top-[17%] left-[68.2%] h-[85%] w-[35%] flex flex-col justify-center items-center pointer-events-auto">
                        <div className="hex-prompt display-border mt-[7%] ml-[-1rem] p-[1rem] pr-[3.2rem] h-[90%] w-[90%] text-[0.8rem] pointer-events-auto overflow-y-scroll">
                            <span className="spaceship-display-screen absolute top-[1.5rem] w-[60%] left-[1.4rem] text-[0.85rem] pointer-events-auto h-[18%] leading-[0.8rem]">
                                SCANNER OUTPUT: <br />
                                {scanOutputIndex + 1}/{scannerOptions.length}
                                <br />
                            </span>
                            <div className="absolute top-[15%] text-[0.9rem] pointer-events-auto spaceship-display-screen  w-[85%] pt-[.5rem] pl-0 pr-0 left-0 leading-[0.8rem]  h-[66%] flex p-[0.5rem] overflow-y-scroll flex-col text-white">
                                <button onClick={() => handlePrevious()}> {`<<`} </button> ||
                                <button
                                    onClick={() => {
                                        handleNext();
                                        console.log("I'm Clicked");
                                    }}
                                >{`>>`}</button>
                            </div>
                            <span className="hex-prompt relative">{scannerOptions[scanOutputIndex]}:</span>
                            <br />
                            <span className="hex-prompt relative top-[0.7rem]">
                                {scannerOutput[scannerOptions[scanOutputIndex]]}
                            </span>
                        </div>{" "}
                    </div>
                </div>
                {stringToHex(metadata ? metadata.description : "No Metadata")}
            </div>
            {imageSrc && (
                <img
                    className="rounded-full absolute h-[70%] w-[28%] top-[-45%] left-[37%] border-[12px] border-black z-[10000100]"
                    src={imageSrc}
                />
            )}
        </div>

*/
}
