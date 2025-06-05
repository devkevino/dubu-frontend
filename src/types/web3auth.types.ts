import { IProvider } from "@web3auth/base";

export interface Web3AuthUser {
  email?: string;
  name?: string;
  profileImage?: string;
  aggregateVerifier?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
  dappShare?: string;
  oAuthIdToken?: string;
  oAuthAccessToken?: string;
  appState?: string;
  touchPoint?: string;
  sessionId?: string;
}

export interface Web3AuthState {
  isLoading: boolean;
  isConnected: boolean;
  user: Web3AuthUser | null;
  provider: IProvider | null;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  networkName: string | null;
}

export interface Web3AuthContextType extends Web3AuthState {
  login: (provider?: LoginProvider) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<Web3AuthUser | null>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<number | null>;
  getNetworkName: () => Promise<string>;
  switchToOpBNBTestnet: () => Promise<boolean>;
  signMessage: (message: string) => Promise<string>;
  getTestBNB: () => void;
}

export type LoginProvider = 
  | "google"
  | "facebook" 
  | "twitter"
  | "discord"
  | "email_passwordless"
  | "web3auth";

// opBNB Testnet 관련 타입들
export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  faucetUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}