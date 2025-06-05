import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { CURRENT_NETWORK } from "../../config/networks";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME || "MineCore Mining Platform";
const networkEnv = import.meta.env.VITE_NETWORK_ENV || 'bsc-testnet';

if (!clientId) {
  throw new Error("Web3Auth Client ID is not set in environment variables");
}

// Determine Web3Auth network based on environment
const getWeb3AuthNetwork = () => {
  if (networkEnv === 'bsc-mainnet') {
    return WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
  }
  return WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
};

// Private Key Provider with current network configuration
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: CURRENT_NETWORK.chainConfig },
});

// Web3Auth Instance with dynamic network configuration
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: getWeb3AuthNetwork(),
  privateKeyProvider,
  uiConfig: {
    appName,
    defaultLanguage: "en",
    mode: "light",
    theme: {
      primary: "#0364ff",
    },
    useLogoLoader: true,
  },
});

// Re-export current network configuration
export { CURRENT_NETWORK } from "../../config/networks";

export default web3auth;