import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import LogViewer from "~~/components/panels/LogViewer";
import { useGlobalState } from "~~/services/store/store";

// Account index to use from generated hardhat accounts.
/**
 * Faucet modal which lets you send ETH to any address.
 */
export const Faucet = () => {
  const [loading, setLoading] = useState(false);

  const { chain: ConnectedChain } = useNetwork();
  const metadata = useGlobalState(state => state.metadata);
  return (
    <div className="">
      <label htmlFor="faucet-modal" className="btn btn-primary btn-sm font-normal normal-case gap-1">
        <BanknotesIcon className="h-4 w-4" />
        <span>Faucet</span>
      </label>
      <input type="checkbox" id="faucet-modal" className="modal-toggle" />
      <label htmlFor="faucet-modal" className="modal left-1/4 top-1/4 h-1/2 w-1/2 cursor-pointer">
        <label className="modal-box relative spaceship-display-screen">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-3">Local Faucet</h3>
          <label htmlFor="faucet-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex space-x-4"></div>
            <div className="flex flex-col space-y-3">
              <span>Send</span>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};
