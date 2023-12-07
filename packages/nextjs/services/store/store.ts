import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import type {
  ApiResponses,
  ChatData,
  InterPlanetaryStatusReport,
  MetaScanData,
  MidjourneyConfig,
  NftData,
  PlanetData,
  Response,
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

type ImageStoreState = {
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
type GlobalState = {
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
};
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
  account: {},
  setAccount: (account: any) => set(() => ({ account })),
  tokenIds: [],
  setTokenIds: (tokenIds: string[]): void => set(() => ({ tokenIds })),
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  nftData: {} as NftData,
  setNftData: (nftData: NftData) => set(state => ({ nftData: { ...state.nftData, ...nftData } })),
  metaScanData: {} as MetaScanData,
  setMetaScanData: (metaScanData: MetaScanData) =>
    set(state => ({ metaScanData: { ...state.metaScanData, ...metaScanData } })),
  planetData: {} as PlanetData,
  setPlanetData: (planetData: PlanetData) => set(state => ({ planetData: { ...state.planetData, ...planetData } })),
  interPlanetaryStatusReport: {} as InterPlanetaryStatusReport,
  setInterPlanetaryStatusReport: (interPlanetaryStatusReport: InterPlanetaryStatusReport) =>
    set(state => ({
      interPlanetaryStatusReport: { ...state.interPlanetaryStatusReport, ...interPlanetaryStatusReport },
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
    }),
}));
