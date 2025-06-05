import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME || "MineCore Mining Platform";

if (!clientId) {
  throw new Error("Web3Auth Client ID is not set in environment variables");
}

// opBNB Testnet Chain Config
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x15eb", // opBNB Testnet Chain ID (5611)
  rpcTarget: "https://opbnb-testnet-rpc.bnbchain.org",
  displayName: "opBNB Testnet",
  blockExplorer: "https://opbnb-testnet.bscscan.com",
  ticker: "BNB",
  tickerName: "BNB",
  logo: "https://images.toruswallet.io/bnb.svg",
};

// Private Key Provider for opBNB Testnet
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Web3Auth Instance with opBNB Testnet configuration
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // 테스트넷용
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

// opBNB Testnet 관련 상수들
export const OPBNB_TESTNET = {
  chainId: 5611,
  chainIdHex: "0x15eb",
  name: "opBNB Testnet",
  rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org",
  blockExplorer: "https://opbnb-testnet.bscscan.com",
  faucetUrl: "https://testnet.bnbchain.org/faucet-smart",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
};

export default web3auth;