import { CHAIN_NAMESPACES } from "@web3auth/base";

export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  displayName: string;
  rpcTarget: string;
  rpcUrl: string;
  blockExplorer: string;
  ticker: string;
  tickerName: string;
  logo: string;
  faucetUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  chainConfig: {
    chainNamespace: typeof CHAIN_NAMESPACES.EIP155;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
    logo: string;
  };
}

// BSC Mainnet Configuration
export const BSC_MAINNET: NetworkConfig = {
  chainId: 56,
  chainIdHex: "0x38",
  name: "BSC Mainnet",
  displayName: "Binance Smart Chain",
  rpcTarget: "https://bsc-dataseed.binance.org",
  rpcUrl: "https://bsc-dataseed.binance.org",
  blockExplorer: "https://bscscan.com",
  ticker: "BNB",
  tickerName: "BNB",
  logo: "https://images.toruswallet.io/bnb.svg",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38",
    rpcTarget: "https://bsc-dataseed.binance.org",
    displayName: "Binance Smart Chain",
    blockExplorer: "https://bscscan.com",
    ticker: "BNB",
    tickerName: "BNB",
    logo: "https://images.toruswallet.io/bnb.svg",
  }
};

// BSC Testnet Configuration
export const BSC_TESTNET: NetworkConfig = {
  chainId: 97,
  chainIdHex: "0x61",
  name: "BSC Testnet",
  displayName: "Binance Smart Chain Testnet",
  rpcTarget: "https://data-seed-prebsc-1-s1.binance.org:8545",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  blockExplorer: "https://testnet.bscscan.com",
  ticker: "BNB",
  tickerName: "BNB",
  logo: "https://images.toruswallet.io/bnb.svg",
  faucetUrl: "https://testnet.binance.org/faucet-smart",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x61",
    rpcTarget: "https://data-seed-prebsc-1-s1.binance.org:8545",
    displayName: "Binance Smart Chain Testnet",
    blockExplorer: "https://testnet.bscscan.com",
    ticker: "BNB",
    tickerName: "BNB",
    logo: "https://images.toruswallet.io/bnb.svg",
  }
};

// Network selector based on environment
export const getNetworkConfig = (): NetworkConfig => {
  const networkEnv = import.meta.env.VITE_NETWORK_ENV || 'bsc-testnet';
  
  switch (networkEnv) {
    case 'bsc-mainnet':
      return BSC_MAINNET;
    case 'bsc-testnet':
    default:
      return BSC_TESTNET;
  }
};

// Export current network
export const CURRENT_NETWORK = getNetworkConfig();