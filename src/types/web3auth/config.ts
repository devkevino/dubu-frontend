import { CHAIN_NAMESPACES, IAdapter, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME || "MineCore Mining Platform";
const appUrl = import.meta.env.VITE_APP_URL || "http://localhost:5173";

if (!clientId) {
  throw new Error("Web3Auth Client ID is not set in environment variables");
}

// Chain Config
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
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

// Web3Auth Instance
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: import.meta.env.VITE_WEB3AUTH_NETWORK === "mainnet" 
    ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET 
    : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
  uiConfig: {
    appName,
    appUrl,
    logoLight: "https://web3auth.io/images/web3authlog.png",
    logoDark: "https://web3auth.io/images/web3authlogodark.png",
    defaultLanguage: "en",
    mode: "auto",
    theme: {
      primary: "#768729",
    },
    useLogoLoader: true,
    modalZIndex: "99999",
  },
});

// OpenLogin Adapter for Social Logins
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      appName,
      appUrl,
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en",
      mode: "auto",
    },
    loginConfig: {
      // Email/Password Login
      email_passwordless: {
        verifier: "email_passwordless",
        typeOfLogin: "email_passwordless",
        clientId,
        name: "Email Passwordless Login",
      },
      // Google Login
      google: {
        verifier: "google",
        typeOfLogin: "google",
        clientId, // Web3Auth가 제공하는 기본 Google OAuth
        name: "Google Login",
      },
      // Facebook Login
      facebook: {
        verifier: "facebook",
        typeOfLogin: "facebook",
        clientId, // Web3Auth가 제공하는 기본 Facebook OAuth
        name: "Facebook Login",
      },
      // Twitter Login
      twitter: {
        verifier: "twitter",
        typeOfLogin: "twitter",
        clientId, // Web3Auth가 제공하는 기본 Twitter OAuth
        name: "Twitter Login",
      },
      // Discord Login
      discord: {
        verifier: "discord",
        typeOfLogin: "discord",
        clientId, // Web3Auth가 제공하는 기본 Discord OAuth
        name: "Discord Login",
      },
    },
  },
  privateKeyProvider,
});

// Metamask Adapter
const metamaskAdapter = new MetamaskAdapter({
  clientId,
  sessionTime: 3600, // 1 hour
  web3AuthNetwork: import.meta.env.VITE_WEB3AUTH_NETWORK === "mainnet"
    ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET 
    : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
});

// Configure Adapters
web3auth.configureAdapter(openloginAdapter);
web3auth.configureAdapter(metamaskAdapter);

export { openloginAdapter, metamaskAdapter };
export default web3auth;