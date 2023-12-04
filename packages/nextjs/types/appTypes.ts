export type Metadata = {
  srcUrl: string;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
  biometricReading: { health: number; status: string[] };
  currentEquipmentAndVehicle: string[];
  currentMissionBrief: string;
  abilities: string[];
  powerLevel: number;
  funFact: string;
  currentLocation: { x: number; y: number; z: number };
  alienMessage: string;
};

export type ApiResponses = {
  interPLanetaryStatusReport: {
    missionId: string;
    heroId: string;
    location: string;
    description: string;
    blockNumber: string;
    difficulty: number;
    experienceReward: number;
  };

  nftData: {
    srcUrl: string | null;
    Level: string;
    Power1: string;
    Power2: string;
    Power3: string;
    Power4: string;
    Alignment1: string;
    Alignment2: string;
    Side: string;
  };
  metaScanData: {
    heroId: string;
    biometricReading: { health: number; status: string[] };
    currentEquipmentAndVehicle: string[];
    currentMissionBrief: string;
    abilities: string[];
    powerLevel: number;
    funFact: string;
    currentLocation: { x: number; y: number; z: number };
    blockNumber: string;
  };

  planetData: {
    planetId: string;
    locationCoordinates: { x: number; y: number; z: number };
    Scan: {
      locationName: string;
      enviromental_analysis: string;
      historical_facts: string[];
      known_entities: string[];
      NavigationNotes: string;
      DescriptiveText: string;
      controlledBy: boolean | null;
    };
  };

  chatData: {
    messages: string[];
    chatId: string;
  };
  imageData: Response;
};

export type ProgressResponseType = {
  progress: number | "incomplete";
  response: {
    createdAt?: string;
    buttons?: string[];
    imageUrl?: string;
    buttonMessageId?: string;
    originatingMessageId?: string;
    content?: string;
    ref?: string;
    responseAt?: string;
  };
};
export type Response = {
  accountId: string;
  createdAt: string;
  originatingMessageId: string;
  ref: string;
  buttons: ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
  imageUrl: string;
  imageUrls: string[];
};

export type StoreState = {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
};

export type Sounds = {
  spaceshipHum?: AudioBuffer | null;
  spaceshipOn?: AudioBuffer | null;
  holographicDisplay?: AudioBuffer | null;
  warpSpeed?: AudioBuffer | null;
};
