import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import type {
  ApiResponses,
  ChatData,
  InterPlanetaryStatusReport,
  MetaScanData,
  MidjourneyConfig,
  NftData,
  PilotData,
  PlanetData,
  Response,
  ShipState,
} from "~~/types/appTypes";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this AppStore, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

export type AppState = {
  loading: boolean;
  setloading: (loading: boolean) => void;
  loadingProgress: number;
  setloadingProgress: (loadingProgress: number) => void;
  originatingMessageId: string;
  setOriginatingMessageId: (originatingMessageId: string) => void;
  error: any;
  setError: (error: any) => void;
  waitingForWebhook: boolean;
  setWaitingForWebhook: (waitingForWebhook: boolean) => void;
  description: string[];
  setDescription: (description: string[]) => void;
  selectedDescriptionIndex: number;
  setSelectedDescriptionIndex: (selectedDescriptionIndex: number) => void;
  selectedTokenId: string;
  setSelectedTokenId: (selectedTokenId: string) => void;
  buttonMessageId: string;
  setButtonMessageId: (buttonMessageId: string) => void;
  backgroundImageUrl: string;
  setBackgroundImageUrl: (backgroundImageUrl: string) => void;
  travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined;
  setTravelStatus: (travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined) => void;
  prevTravelStatus: string;
  setPrevTravelStatus: (prevTravelStatus: string) => void;
  selectedDescription: string;
  setSelectedDescription: (selectedDescription: string) => void;
  modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string;
  setModifiedPrompt: (modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string) => void;
  warping: boolean;
  setWarping: (warping: boolean) => void;
  scanning: boolean;
  setScanning: (scanning: boolean) => void;
  preExtraText: string;
  setPreExtraText: (preExtraText: string) => void;
  AfterExtraText: string;
  setAfterExtraText: (AfterExtraText: string) => void;
};

export type ImageStoreState = {
  imageUrl: string;
  setImageUrl: (imageUrl: string) => void;
  backgroundImageUrl: string;
  setBackgroundImageUrl: (backgroundImageUrl: string) => void;
  displayImageUrl: string;
  setdisplayImageUrl: (displayImageUrl: string) => void;
  srcUrl: string;
  setSrcUrl: (srcUrl: string) => void;

  resetImages: () => void;
};
export type GlobalState = {
  intakeForm: PilotData;
  setIntakeForm: (intakeForm: PilotData) => void;
  pilotData: Partial<PilotData>;
  setPilotData: (pilotData: Partial<PilotData>) => void;
  chatData: Partial<ChatData>;
  setChatData: (chatState: Partial<ChatData>) => void;
  shipState: ShipState;
  setShipState: (shipState: Partial<ShipState>) => void;
  tokenIds: string[];
  setTokenIds: (tokenIds: string[]) => void;
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  // Existing properties
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;
  nftData: NftData;
  setNftData: (newNftData: NftData) => void;
  metaScanData: MetaScanData;
  setMetaScanData: (newMetaScanData: MetaScanData) => void;
  setPlanetData: (newNftData: PlanetData) => void;
  planetData: PlanetData;
  interPlanetaryStatusReport: InterPlanetaryStatusReport;
  setInterPlanetaryStatusReport: (newInterPlanetaryStatusReport: InterPlanetaryStatusReport) => void;
  midjourneyConfig: MidjourneyConfig;
  setMidjourneyConfig: (newMidjourneyConfig: Partial<MidjourneyConfig>) => void;
  travels: Partial<ApiResponses>[];
  setTravels: (newTravel: any) => void;
  apiResponses: ApiResponses;
  setApiResponses: (response: Partial<ApiResponses>) => void;
  reset: () => void;
  account: any;
  setAccount: (account: any) => void;
  setEngaged: (engaged: boolean) => void;
  engaged: boolean;
};
export const useAppStore = create<AppState>(set => ({
  loading: false,
  setloading: (loading: boolean) => set({ loading }),
  loadingProgress: 0,
  setloadingProgress: (loadingProgress: number) => set({ loadingProgress }),
  originatingMessageId: "",
  setOriginatingMessageId: (originatingMessageId: string) => set({ originatingMessageId }),
  error: "",
  setError: (error: any) => set({ error }),
  waitingForWebhook: false,
  setWaitingForWebhook: (waitingForWebhook: boolean) => set({ waitingForWebhook }),
  description: [],
  setDescription: (description: string[]) => set({ description }),
  selectedDescriptionIndex: 0,
  setSelectedDescriptionIndex: (selectedDescriptionIndex: number) => set({ selectedDescriptionIndex }),
  selectedTokenId: "",
  setSelectedTokenId: (selectedTokenId: string) => set({ selectedTokenId }),
  buttonMessageId: "",
  setButtonMessageId: (buttonMessageId: string) => set({ buttonMessageId }),
  backgroundImageUrl: "assets/background.png",
  setBackgroundImageUrl: (backgroundImageUrl: string) => set({ backgroundImageUrl }),
  travelStatus: "NoTarget",
  setTravelStatus: (travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined) =>
    set({ travelStatus }),
  prevTravelStatus: "",
  setPrevTravelStatus: (prevTravelStatus: string) => set({ prevTravelStatus }),
  selectedDescription: "",
  setSelectedDescription: (selectedDescription: string) => set({ selectedDescription }),
  modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE",
  setModifiedPrompt: (modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string) => set({ modifiedPrompt }),
  warping: false,
  setWarping: (warping: boolean) => set({ warping }),
  scanning: false,
  setScanning: (scanning: boolean) => set({ scanning }),
  preExtraText: "",
  setPreExtraText: (preExtraText: string) => set({ preExtraText }),
  AfterExtraText: "",
  setAfterExtraText: (AfterExtraText: string) => set({ AfterExtraText }),
}));

export const useImageStore = create<ImageStoreState>(set => ({
  imageUrl: "",
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
  backgroundImageUrl: "",
  setBackgroundImageUrl: (backgroundImageUrl: string) => set({ backgroundImageUrl }),
  displayImageUrl: "",
  setdisplayImageUrl: (displayImageUrl: string) => set({ displayImageUrl }),
  srcUrl: "",
  setSrcUrl: (srcUrl: string) => set({ srcUrl }),
  resetImages: () => set({ imageUrl: "", backgroundImageUrl: "", displayImageUrl: "", srcUrl: "" }),
}));
export const useGlobalState = create<GlobalState>(set => ({
  chatData: { naviMessages: [] } as Partial<ChatData>,
  setChatData: (chatData: Partial<ChatData>) => set(state => ({ chatData: { ...state.chatData, ...chatData } })),
  shipState: {} as ShipState,
  setShipState: (shipState: Partial<ShipState>) => set(state => ({ shipState: { ...state.shipState, ...shipState } })),
  engaged: false,
  setEngaged: (engaged: boolean) => set({ engaged }),
  account: {},
  setAccount: (account: any) => set(() => ({ account })),
  tokenIds: [],
  setTokenIds: (tokenIds: string[]): void => set(() => ({ tokenIds })),
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  nftData: {} as NftData,
  setNftData: (nftData: NftData) => set(() => ({ nftData: nftData })),
  metaScanData: {} as MetaScanData,
  setMetaScanData: (metaScanData: MetaScanData) => set(() => ({ metaScanData: metaScanData })),
  planetData: {} as PlanetData,
  setPlanetData: (planetData: PlanetData) => set(() => ({ planetData: planetData })),
  interPlanetaryStatusReport: {} as InterPlanetaryStatusReport,
  setInterPlanetaryStatusReport: (interPlanetaryStatusReport: InterPlanetaryStatusReport) =>
    set(() => ({
      interPlanetaryStatusReport: interPlanetaryStatusReport,
    })),
  midjourneyConfig: {} as MidjourneyConfig,
  setMidjourneyConfig: (midjourneyConfig: Partial<MidjourneyConfig>) =>
    set(state => ({ midjourneyConfig: { ...state.midjourneyConfig, ...midjourneyConfig } })),
  ethPrice: 0,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),

  travels: [],
  setTravels: (newTravel: Partial<ApiResponses>) => set(state => ({ travels: [...state.travels, newTravel] })),
  apiResponses: {} as ApiResponses,
  setApiResponses: (response: Partial<ApiResponses>) =>
    set(state => ({ apiResponses: { ...state.apiResponses, ...response } })),
  reset: () =>
    set({
      apiResponses: {} as ApiResponses,
      midjourneyConfig: {} as MidjourneyConfig,
      interPlanetaryStatusReport: {} as InterPlanetaryStatusReport,
      planetData: {} as PlanetData,
      metaScanData: {} as MetaScanData,
      nftData: {} as NftData,
      pilotData: {} as PilotData,
    }),
  intakeForm: {} as PilotData,
  setIntakeForm: (intakeForm: PilotData) => set(() => ({ intakeForm: intakeForm })),
  pilotData: {} as Partial<PilotData>,
  setPilotData: (pilotData: Partial<PilotData>) => set(() => ({ pilotData: pilotData })),
}));
