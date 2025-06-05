import React from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { useWeb3Auth } from '../../providers/Web3AuthProvider';
import { OPBNB_TESTNET } from '../../lib/web3auth/config';

export const NetworkInfo: React.FC = () => {
  const { chainId, networkName, switchToOpBNBTestnet, getTestBNB, isConnected } = useWeb3Auth();

  if (!isConnected) return null;

  const isCorrectNetwork = chainId === OPBNB_TESTNET.chainId;

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">Connected to {networkName}</span>
          </div>
          <button
            onClick={getTestBNB}
            className="inline-flex items-center text-sm text-green-700 hover:text-green-900"
          >
            Get Test BNB
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-yellow-800 font-medium">Wrong Network Detected</h3>
          <p className="text-yellow-700 text-sm mt-1">
            You're connected to {networkName} (Chain ID: {chainId}). 
            Please switch to opBNB Testnet for the best experience.
          </p>
          <button
            onClick={switchToOpBNBTestnet}
            className="inline-flex items-center mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-md hover:bg-yellow-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Switch to opBNB Testnet
          </button>
        </div>
      </div>
    </div>
  );
};

export const NetworkStatus: React.FC = () => {
  const { chainId, networkName, balance, address } = useWeb3Auth();

  if (!address) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-xs text-gray-500">Network</p>
        <p className="font-medium text-gray-900">{networkName}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Chain ID</p>
        <p className="font-medium text-gray-900">{chainId}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Balance</p>
        <p className="font-medium text-gray-900">
          {balance ? `${parseFloat(balance).toFixed(4)} BNB` : '0 BNB'}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Address</p>
        <p className="font-medium text-gray-900 font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </div>
  );
};