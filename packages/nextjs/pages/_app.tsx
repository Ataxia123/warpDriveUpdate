import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import "~~/globals.css";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState, useQuipuxStore, useAppStore } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import { useProvider, useSigner } from "~~/utils/wagmi-utils";
import { useAccount, useBlockNumber } from "wagmi";
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
    const price = useNativeCurrencyPrice();
    const quipux = useQuipuxStore();
    const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
    const setDeployedContract = useAppStore(state => state.setContractInstance);
    const { data: deployedContract } = useDeployedContractInfo("WarpDrive");

    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const eas = new EAS(EASContractAddress);

    const fetchDb = async () => {

        // Initialize the sdk with the address of the EAS Schema contract address
        quipux.setEas(eas);

        try {
            const response = await fetch("http://0.0.0.0:3000/aiu/database"); // assume the same host
            ;
            const json = await response.json();
            console.log(json, "Player data from DB");
            quipux.setDatabase(json)

        } catch (e: any) {
            console.log(e.message);


        }
    };
    useEffect(() => {
        if (deployedContract) {
            setDeployedContract(deployedContract);
        }
    }, [deployedContract])

    useEffect(() => {
        fetchDb();
    }, []);

    useEffect(() => {
        if (price > 0) {
            setNativeCurrencyPrice(price);
        }
    }, [setNativeCurrencyPrice, price]);

    return (
        <>
            <div className="fixed flex-col min-h-screen">
                <main className="relative flex flex-col flex-1">
                    <Header />

                    <Component {...pageProps} />
                </main>
                <Footer />
            </div>
            {/*<Toaster
                containerClassName=""
                toastOptions={{

                    className: "spaceship-display-screen",

                    success: {

                        duration: 8000,
                        style: {
                            background: "#1f2937",
                            color: "#fff",
                        },
                        iconTheme: {
                            primary: 'orange',
                            secondary: 'black',
                        },

                    },
                }}
                position="bottom-right"
            >
                {(t) => (
                    <ToastBar toast={t}>
                        {({ icon, message }) => (
                            <>
                                {icon}
                                {message}
                                {t.type !== 'loading' && (
                                    <button onClick={() => toast.dismiss(t.id)}>X</button>
                                )}
                            </>
                        )}
                    </ToastBar>
                )}
            </Toaster>*/}
        </>
    );
};

const ScaffoldEthAppWithProviders = (props: AppProps) => {
    // This variable is required for initial client side rendering of correct theme for RainbowKit
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const { isDarkMode } = useDarkMode();
    useEffect(() => {
        setIsDarkTheme(isDarkMode);
    }, [isDarkMode]);

    return (
        <WagmiConfig config={wagmiConfig}>
            <NextNProgress />
            <RainbowKitProvider
                chains={appChains.chains}
                avatar={BlockieAvatar}
                theme={isDarkTheme ? darkTheme() : lightTheme()}
            >
                <ScaffoldEthApp {...props} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export default ScaffoldEthAppWithProviders;
