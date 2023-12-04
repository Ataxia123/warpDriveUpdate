import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import type { ApiResponses, Metadata, Response } from "~~/types/appTypes";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this AppStore, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type ImageStoreState = {
  imageUrl: string | null;
  setImageUrl: (imageUrl: string) => void;
};
type GlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  // Existing properties
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;

  // New properties
  backgroundImageUrl: string;
  setBackgroundImageUrl: (backgroundImageUrl: string, type: string) => void;
  displayImageUrl: string;
  setdisplayImageUrl: (displayImageUrl: string, type: string) => void;
  metadata: Metadata;
  setMetadata: (metadata: Partial<Metadata>) => void;
  travels: ApiResponses[];
  setTravels: (newTravel: any) => void;
  apiResponses: ApiResponses;
  setApiResponses: (response: Partial<ApiResponses>) => void;
};
export const useImageStore = create<ImageStoreState>(set => ({
  imageUrl: null,
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
}));
export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),

  ethPrice: 0,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),

  backgroundImageUrl: "",
  setBackgroundImageUrl: (backgroundImageUrl: string, type: string) =>
    set(state => (type === "background" ? { backgroundImageUrl } : state)),

  displayImageUrl: "",
  setdisplayImageUrl: (displayImageUrl: string, type: string) =>
    set(state => (type === "character" ? { displayImageUrl } : state)),

  metadata: {
    // Initialize with default values
    srcUrl: "",
    Level: "",
    Power1: "",
    Power2: "",
    Power3: "",
    Power4: "",
    Alignment1: "",
    Alignment2: "",
    Side: "",
    interplanetaryStatusReport: "",
    selectedDescription: "",
    nijiFlag: false,
    vFlag: false,
    biometricReading: { health: 0, status: [""] },
    currentEquipmentAndVehicle: [""],
    currentMissionBrief: "",
    abilities: [],
    powerLevel: 0,
    funFact: "",
    currentLocation: { x: 0, y: 0, z: 0 },
    alienMessage: "",
  },
  setMetadata: (metadata: Partial<Metadata>) => set(state => ({ metadata: { ...state.metadata, ...metadata } })),
  travels: [],
  setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
  apiResponses: {
    interPLanetaryStatusReport: {
      missionId: "",
      heroId: "",
      location: "",
      description: "",
      blockNumber: "",
      difficulty: 0,
      experienceReward: 0,
    },

    nftData: {
      srcUrl: null,
      Level: "",
      Power1: "",
      Power2: "",
      Power3: "",
      Power4: "",
      Alignment1: "",
      Alignment2: "",
      Side: "",
    },
    metaScanData: {
      heroId: "",
      biometricReading: { health: 0, status: [""] },
      currentEquipmentAndVehicle: [""],
      currentMissionBrief: "",
      abilities: [],
      powerLevel: 0,
      funFact: "",
      currentLocation: { x: 0, y: 0, z: 0 },
      blockNumber: "",
    },

    planetData: {
      planetId: "",
      locationCoordinates: { x: 0, y: 0, z: 0 },
      Scan: {
        locationName: "",
        enviromental_analysis: "",
        historical_facts: [],
        known_entities: [],
        NavigationNotes: "",
        DescriptiveText: "",
        controlledBy: null,
      },
    },

    chatData: {
      messages: [],
      chatId: "",
    },

    imageData: {} as Response,
  },
  setApiResponses: (response: Partial<ApiResponses>) =>
    set(state => ({ apiResponses: { ...state.apiResponses, ...response } })),
}));
