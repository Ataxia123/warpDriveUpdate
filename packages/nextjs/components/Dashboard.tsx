// components/Dashboard/Dashboard.tsx
import React from "react";
import Image from "next/image";
import Background from "./Background";
import { MarqueePanel } from "./panels/MarqueePannel";

interface DashboardProps {
  loadingProgress: number;
  scanning: boolean;
  error: string;
  warping: boolean;
  children: React.ReactNode;
  travelStatus: string | undefined;
  dynamicImageUrl: string;
  imageUrl: string;
  srcUrl: string;
  onSubmitPrompt: (type: "character" | "background") => Promise<void>;
  onSubmit: (type: "character" | "background") => Promise<void>;
  handleButtonClick: (button: string, type: "character" | "background") => void;
  buttonMessageId: string;
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  loadingProgress,
  error,
  warping,
  imageUrl,
  srcUrl,
  onSubmitPrompt,
  onSubmit,
  handleButtonClick,
  buttonMessageId,
  children,
  travelStatus,
  dynamicImageUrl,
  loading,
  scanning,
}) => {
  return (
    <>
      <div className="dashboard">
        <Image className="staticOverlay w-full h-full" src="/assets/view.png" alt="Static Image Overlay" fill />
        <MarqueePanel
          loadingProgress={loadingProgress}
          error={error}
          imageUrl={imageUrl}
          srcUrl={srcUrl}
          onSubmitPrompt={onSubmitPrompt}
          onSubmit={onSubmit}
          handleButtonClick={handleButtonClick}
          loading={loading}
          buttonMessageId={buttonMessageId}
        />
        <Background
          loadingProgress={loadingProgress}
          scanning={scanning}
          warping={warping}
          travelStatus={travelStatus}
          dynamicImageUrl={dynamicImageUrl}
          fixedImageUrl="assets/view.png"
        ></Background>

        {children}
      </div>
    </>
  );
};

export default Dashboard;
