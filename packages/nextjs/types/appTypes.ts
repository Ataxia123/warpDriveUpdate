export type MidjourneyConfig = {
  nijiFlag: boolean;
  vFlag: boolean;
  selectedDescription: string;
  url: string;
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
export type ToggleOptions = {
  interPlanetaryStatusReport?: Partial<Record<keyof InterPlanetaryStatusReport, boolean>>;
  nftData?: Partial<Record<keyof NftData, boolean>>;
  metaScanData?: Partial<Record<keyof MetaScanData, boolean>>;
  planetData?: Partial<Record<keyof PlanetData, boolean>>;
  chatData?: Partial<Record<keyof ChatData, boolean>>;
  imageData?: boolean; // Assuming imageData is a simple boolean toggle
  midJourneyConfig?: Partial<Record<keyof MidjourneyConfig, boolean>>;
};

export type ApiResponses = {
  interPlanetaryStatusReport: InterPlanetaryStatusReport;
  nftData: NftData;
  metaScanData: MetaScanData;
  planetData: PlanetData;
  chatData: ChatData;
  imageData: Response;
  midjourneyConfig: MidjourneyConfig;
};

export type InterPlanetaryStatusReport = {
  missionId: string;
  location: { planet_name: string; coordinates: { x: number; y: number; z: number } };
  characters: { fName: string; members: string[] };
  objective: string;
  status: string;
  surroundingsDescription: string;
  conflictDescription: string;
  metadata: { difficulty: number; EXPrewards: number; missionId: string };
  narrative: string;
};

export type NftData = {
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
};
export type MetaScanData = {
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

export type PlanetData = {
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

export type ChatData = {
  messages: string[];
  chatId: string;
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
