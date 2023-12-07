import { useGlobalState } from "~~/services/store/store";
import type { ApiResponses, Response } from "~~/types/appTypes";
import { stringToHex } from "~~/utils/nerdUtils";

interface PromptPanelProps {
  loadingProgress: number;
  error: string;
  buttonMessageId: string | "";
  imageUrl: string;
  srcUrl: string | null;
  loading: boolean;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
}

export const MarqueePanel: React.FC<PromptPanelProps> = ({ loadingProgress, error }) => {
  const interplanetaryStatusReport = useGlobalState(state => state.interPlanetaryStatusReport);
  const nftData = useGlobalState(state => state.nftData);

  return (
    <>
      <div className="marquee-container spaceship-display-screen">
        <h2 className="text-s font-bold marquee-title description-text">AI-U BROADCAST</h2>
        <div className="screen-border">
          <div
            style={{
              position: "relative",
              top: "0",
              left: "5%",
              width: "100%",
              height: "100%",
              display: "flex",
            }}
            className="spaceship-screen-display"
          >
            Loading:{loadingProgress}
            <br />
          </div>
          <br />

          <p className="marquee-content" id="mc">
            {stringToHex(error ? error : nftData.Level ? nftData.Level : "")}
            RESPONSE------ INTERPLANETARY STATUS REPORT: {JSON.stringify(interplanetaryStatusReport.location)}{" "}
            ESTABLISHING CONNECTION WITH:
            {nftData.Level} {nftData.Power1}
            {nftData.Power2} {nftData.Power3} {nftData.Power4}
          </p>
        </div>
      </div>
    </>
  );
};
