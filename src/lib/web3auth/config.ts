import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME || "MineCore Mining Platform";
const appUrl = import.meta.env.VITE_APP_URL || "http://localhost:5173";

if (!clientId) {
  throw new Error("Web3Auth Client ID is not set in environment variables");
}

// Chain Config for Ethereum
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://api.web3auth.io/infura-service/v1/0x1/BF-XLNgK2tqzZCsJ5Y-5JIoTXsoyJGe13jgNPgLER3jLGnLc4sMBtXerxveYjXCbxqeWt83pLA9FCxzWFFK-Hhc",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
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
      primary: "#0364ff",
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
      // Google Login
      google: {
        verifier: "google",
        typeOfLogin: "google",
        clientId: "761106464005-2h82vnh4fd7ib85o2jj7uf6bv8t93n4q.apps.googleusercontent.com", // Web3Auth 기본 Google Client ID
        name: "Google Login",
      },
      // Facebook Login
      facebook: {
        verifier: "facebook",
        typeOfLogin: "facebook",
        clientId: "647511955816227", // Web3Auth 기본 Facebook App ID
        name: "Facebook Login",
      },
      // Twitter Login
      twitter: {
        verifier: "twitter",
        typeOfLogin: "twitter",
        clientId: "A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO", // Web3Auth 기본 Twitter Client ID
        name: "Twitter Login",
      },
      // Discord Login
      discord: {
        verifier: "discord",
        typeOfLogin: "discord",
        clientId: "682533837464666198", // Web3Auth 기본 Discord Client ID
        name: "Discord Login",
      },
      // Email Passwordless
      email_passwordless: {
        verifier: "email_passwordless",
        typeOfLogin: "email_passwordless",
        name: "Email Passwordless Login",
      },
    },
  },
  privateKeyProvider,
});

// Configure Adapter
web3auth.configureAdapter(openloginAdapter);

export { openloginAdapter };
export default web3auth;