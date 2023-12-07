import React, { useState } from "react";
import ChatWithCaptain from "./ChatWithCaptain";
import { useGlobalState, useImageStore } from "~~/services/store/store";
import type { ApiResponses, PlanetData } from "~~/types/appTypes";

// Dummy data for demonstration purposes

interface LogViewerProps {
  playHolographicDisplay: () => void;
}
const LogViewer: React.FC<LogViewerProps> = ({ playHolographicDisplay }) => {
  const useAppStoreData = () => {
    const { travels } = useGlobalState();

    const { imageUrl, setImageUrl } = useImageStore();

    const [currentTravelIndex, setCurrentTravelIndex] = useState(0);
    const [currentSection, setCurrentSection] = useState(2);
    const handlePrevious = () => {
      if (currentTravelIndex > 0) {
        setCurrentTravelIndex(currentTravelIndex - 1);
        playHolographicDisplay();
      }
    };

    const handleNext = () => {
      if (currentTravelIndex < travels.length - 1) {
        setCurrentTravelIndex(currentTravelIndex + 1);
      }
    };

    const setCurrentTravelSection = (section: number) => {
      playHolographicDisplay();
      setCurrentSection(section);
    };

    return {
      currentTravelIndex,
      imageUrl,
      currentSection,
      setCurrentTravelSection,
      handlePrevious,
      handleNext,
    };
  };

  const { planetData } = useGlobalState(state => ({
    setMetadata: state.setApiResponses,
    travels: state.travels,
    setTravels: state.setTravels,
    apiResponses: state.apiResponses,
    handleApiResponse: state.setApiResponses,
    planetData: state.planetData,
  }));

  const scan = planetData.Scan as Partial<PlanetData>;
  const [count, setCount] = useState(0);
  const planetOptions = [
    "locationName",
    "environmental_analysis",
    "historical_facts",
    "known_entities",
    "NavigationNotes",
    "DescriptiveText",
    "controlledBy",
  ];
  const index = () => {
    playHolographicDisplay();
    if (count < planetOptions.length - 1) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  };

  // Custom hook for managing app store data
  // Custom hook for managing app store data

  return (
    <div className="relative spaceship-screen-display top-0">
      <div className="" style={{ padding: "1rem" }}>
        <div
          className="overflow-x-clip overflow-y-scroll cursor-pointer"
          onClick={() => {
            index();
          }}
        >
          Scan: <br />
          <span className="text-white text-2xl">{planetOptions[count]} </span> <br />
          <div className="text-lg">
            {planetData.Scan && JSON.stringify(scan[planetOptions[count] as keyof PlanetData])}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
