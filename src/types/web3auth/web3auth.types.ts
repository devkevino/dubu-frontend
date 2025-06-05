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
}

export interface Web3AuthContextType extends Web3AuthState {
  login: (provider?: LoginProvider) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<Web3AuthUser | null>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
}

export type LoginProvider = 
  | "google"
  | "facebook" 
  | "twitter"
  | "discord"
  | "email_passwordless"
  | "web3auth";