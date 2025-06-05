import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME || "DUBU Coin";

if (!clientId) {
  throw new Error("Web3Auth Client ID is not set in environment variables");
}

// Chain Config for Ethereum (간소화)
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

// Private Key Provider
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// 최소 설정 Web3Auth Instance
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // 항상 testnet 사용
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

export default web3auth;