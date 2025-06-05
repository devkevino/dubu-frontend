import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { useWeb3Auth } from '../../providers/Web3AuthProvider';
import { CURRENT_NETWORK } from '../../config/networks';
import { Button } from './Button';

export const NetworkSwitch: React.FC = () => {
  const { chainId, networkName, switchToOpBNBTestnet, getTestBNB, isConnected } = useWeb3Auth();
  const [isSwitching, setIsSwitching] = useState(false);

  if (!isConnected) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <WifiOff className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-gray-600 font-medium">Not Connected</p>
            <p className="text-gray-500 text-sm">Please connect your wallet to continue</p>
          </div>
        </div>
      </div>
    );
  }

  const isCorrectNetwork = chainId === CURRENT_NETWORK.chainId;

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      const success = await switchToOpBNBTestnet();
      if (success) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>Connected to {CURRENT_NETWORK.displayName}</span>
              </p>
              <p className="text-green-600 text-sm">Chain ID: {chainId} • Ready for mining</p>
            </div>
          </div>
          {CURRENT_NETWORK.faucetUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={getTestBNB}
              icon={ExternalLink}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Get Test BNB
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-yellow-800 font-medium">Wrong Network Detected</h3>
          <p className="text-yellow-700 text-sm mt-1">
            Currently connected to <strong>{networkName}</strong> (Chain ID: {chainId}).
            <br />
            Switch to {CURRENT_NETWORK.displayName} for full functionality and optimal mining experience.
          </p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSwitchNetwork}
                loading={isSwitching}
                icon={RefreshCw}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Switch to {CURRENT_NETWORK.displayName}
              </Button>
              <a
                href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-700 text-sm hover:text-yellow-900 underline flex items-center"
              >
                Learn more about BSC
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            {/* Network Comparison */}
            <div className="bg-yellow-100 rounded-lg p-3 mt-3">
              <h4 className="text-yellow-800 font-medium text-sm mb-2">Network Comparison</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-yellow-700 font-medium">Current Network</p>
                  <p className="text-yellow-600">{networkName}</p>
                  <p className="text-yellow-600">Chain ID: {chainId}</p>
                </div>
                <div>
                  <p className="text-yellow-700 font-medium">Recommended Network</p>
                  <p className="text-yellow-600">{CURRENT_NETWORK.displayName}</p>
                  <p className="text-yellow-600">Chain ID: {CURRENT_NETWORK.chainId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NetworkInfo: React.FC = () => {
  const { chainId, networkName, balance, address, isConnected } = useWeb3Auth();

  if (!isConnected || !address) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Network Information</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Network</p>
          <p className="font-medium text-gray-900">{networkName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Chain ID</p>
          <p className="font-medium text-gray-900">{chainId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
          <p className="font-medium text-gray-900">
            {balance ? `${parseFloat(balance).toFixed(4)} BNB` : '0 BNB'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
          <p className="font-medium text-gray-900 font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
      </div>
      
      {/* Additional Network Details */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${chainId === CURRENT_NETWORK.chainId ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {chainId === CURRENT_NETWORK.chainId ? 'Optimal Network' : 'Suboptimal Network'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={CURRENT_NETWORK.blockExplorer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline flex items-center"
            >
              Block Explorer
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            {chainId === CURRENT_NETWORK.chainId && CURRENT_NETWORK.faucetUrl && (
              <a
                href={CURRENT_NETWORK.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 underline flex items-center"
              >
                Faucet
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NetworkStatus: React.FC = () => {
  const { chainId, networkName, balance, address, isConnected } = useWeb3Auth();

  if (!isConnected || !address) return null;

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

export default NetworkSwitch;