import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WALLET_ADAPTERS, ADAPTER_EVENTS, IProvider } from "@web3auth/base";
import Web3 from "web3";
import web3auth, { OPBNB_TESTNET } from '../lib/web3auth/config';
import { Web3AuthContextType, Web3AuthState, Web3AuthUser, LoginProvider } from '../types/web3auth.types';

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

interface Web3AuthProviderProps {
  children: ReactNode;
}

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<Web3AuthState>({
    isLoading: true,
    isConnected: false,
    user: null,
    provider: null,
    address: null,
    balance: null,
    chainId: null,
    networkName: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🔄 [Web3Auth] Initializing for opBNB Testnet...');
        setState((prev: Web3AuthState) => ({ ...prev, isLoading: true }));
        
        // Web3Auth 초기화
        await web3auth.initModal();
        console.log('✅ [Web3Auth] Modal initialized for opBNB Testnet');
        
        // 기존 연결 확인
        if (web3auth.connected) {
          console.log('🔗 [Web3Auth] Already connected, updating user info...');
          await updateUserInfo();
        } else {
          console.log('🚫 [Web3Auth] Not connected');
          setState((prev: Web3AuthState) => ({ 
            ...prev, 
            isLoading: false,
            networkName: OPBNB_TESTNET.name,
            chainId: OPBNB_TESTNET.chainId,
          }));
        }
      } catch (error) {
        console.error('❌ [Web3Auth] Initialization error:', error);
        setState((prev: Web3AuthState) => ({ ...prev, isLoading: false }));
      }
    };

    init();

    // Web3Auth 이벤트 리스너
    const handleConnected = () => {
      console.log('🎉 [Web3Auth] Connected event fired');
      updateUserInfo();
    };

    const handleDisconnected = () => {
      console.log('👋 [Web3Auth] Disconnected event fired');
      setState((prev: Web3AuthState) => ({
        ...prev,
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: null,
        chainId: OPBNB_TESTNET.chainId,
        networkName: OPBNB_TESTNET.name,
      }));
    };

    const handleConnecting = () => {
      console.log('⏳ [Web3Auth] Connecting to opBNB Testnet...');
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: true }));
    };

    web3auth.on(ADAPTER_EVENTS.CONNECTED, handleConnected);
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, handleDisconnected);
    web3auth.on(ADAPTER_EVENTS.CONNECTING, handleConnecting);

    return () => {
      web3auth.off(ADAPTER_EVENTS.CONNECTED, handleConnected);
      web3auth.off(ADAPTER_EVENTS.DISCONNECTED, handleDisconnected);
      web3auth.off(ADAPTER_EVENTS.CONNECTING, handleConnecting);
    };
  }, []);

  const updateUserInfo = async () => {
    try {
      console.log('📊 [Web3Auth] Updating user info for opBNB Testnet...');
      const user = await getUserInfo();
      const provider = web3auth.provider;
      const accounts = await getAccounts();
      const address = accounts[0] || null;
      const balance = address ? await getBalance() : null;
      const chainId = await getChainId();
      const networkName = await getNetworkName();

      console.log('👤 [Web3Auth] User info retrieved:', {
        email: user?.email,
        name: user?.name,
        verifier: user?.verifier,
        typeOfLogin: user?.typeOfLogin,
        address,
        balance,
        chainId,
        networkName
      });

      setState((prev: Web3AuthState) => ({
        ...prev,
        isConnected: true,
        user,
        provider,
        address,
        balance,
        chainId,
        networkName,
        isLoading: false,
      }));

      // localStorage에 사용자 정보 저장 (페이지 새로고침시 복원용)
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userAddress', address || '');
        localStorage.setItem('chainId', chainId?.toString() || '');
      }

      // 네트워크 체크
      if (chainId !== OPBNB_TESTNET.chainId) {
        console.warn('⚠️ [Web3Auth] Connected to wrong network. Expected opBNB Testnet.');
        await switchToOpBNBTestnet();
      }
    } catch (error) {
      console.error('❌ [Web3Auth] Error updating user info:', error);
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (loginProvider?: LoginProvider) => {
    try {
      console.log('🚪 [Web3Auth] Starting login with provider:', loginProvider);
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: true }));

      let provider: IProvider | null = null;

      if (loginProvider && loginProvider !== 'web3auth') {
        // 특정 소셜 로그인 제공자 지정
        provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: loginProvider === 'email_passwordless' ? 'email_passwordless' : loginProvider,
        });
      } else {
        // Web3Auth 모달을 통한 일반 로그인
        provider = await web3auth.connect();
      }

      if (provider) {
        console.log('🎉 [Web3Auth] Login successful, updating user info...');
        await updateUserInfo();
      } else {
        console.log('❌ [Web3Auth] Login failed - no provider returned');
        setState((prev: Web3AuthState) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('❌ [Web3Auth] Login error:', error);
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 [Web3Auth] Starting logout...');
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: true }));
      
      await web3auth.logout();
      
      // localStorage 정리
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('chainId');
      localStorage.removeItem('miningState');
      
      console.log('✅ [Web3Auth] Logout completed');
      
      setState({
        isLoading: false,
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: null,
        chainId: OPBNB_TESTNET.chainId,
        networkName: OPBNB_TESTNET.name,
      });
    } catch (error) {
      console.error('❌ [Web3Auth] Logout error:', error);
      setState((prev: Web3AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  const getUserInfo = async (): Promise<Web3AuthUser | null> => {
    try {
      if (!web3auth.connected) return null;
      const userInfo = await web3auth.getUserInfo();
      return userInfo as Web3AuthUser;
    } catch (error) {
      console.error('❌ [Web3Auth] Get user info error:', error);
      return null;
    }
  };

  const getAccounts = async (): Promise<string[]> => {
    try {
      if (!web3auth.provider) return [];
      
      const web3 = new Web3(web3auth.provider as unknown as string);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error) {
      console.error('❌ [Web3Auth] Get accounts error:', error);
      return [];
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      if (!web3auth.provider || !state.address) return '0';
      
      const web3 = new Web3(web3auth.provider as unknown as string);
      const balance = await web3.eth.getBalance(state.address);
      return Web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('❌ [Web3Auth] Get balance error:', error);
      return '0';
    }
  };

  const getChainId = async (): Promise<number | null> => {
    try {
      if (!web3auth.provider) return null;
      
      const web3 = new Web3(web3auth.provider as unknown as string);
      const chainId = await web3.eth.getChainId();
      return Number(chainId);
    } catch (error) {
      console.error('❌ [Web3Auth] Get chain ID error:', error);
      return null;
    }
  };

  const getNetworkName = async (): Promise<string> => {
    try {
      const chainId = await getChainId();
      if (chainId === OPBNB_TESTNET.chainId) {
        return OPBNB_TESTNET.name;
      }
      return `Unknown Network (${chainId})`;
    } catch (error) {
      console.error('❌ [Web3Auth] Get network name error:', error);
      return 'Unknown Network';
    }
  };

  const switchToOpBNBTestnet = async (): Promise<boolean> => {
    try {
      if (!web3auth.provider) {
        throw new Error('Provider not available');
      }

      // MetaMask 스타일의 네트워크 전환 요청
      await (web3auth.provider as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: OPBNB_TESTNET.chainIdHex }],
      });

      console.log('✅ [Web3Auth] Switched to opBNB Testnet');
      return true;
    } catch (switchError: any) {
      // 네트워크가 추가되지 않은 경우 추가 시도
      if (switchError.code === 4902) {
        try {
          await (web3auth.provider as any).request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: OPBNB_TESTNET.chainIdHex,
              chainName: OPBNB_TESTNET.name,
              rpcUrls: [OPBNB_TESTNET.rpcUrl],
              blockExplorerUrls: [OPBNB_TESTNET.blockExplorer],
              nativeCurrency: OPBNB_TESTNET.nativeCurrency,
            }],
          });

          console.log('✅ [Web3Auth] Added and switched to opBNB Testnet');
          return true;
        } catch (addError) {
          console.error('❌ [Web3Auth] Failed to add opBNB Testnet:', addError);
          return false;
        }
      } else {
        console.error('❌ [Web3Auth] Failed to switch to opBNB Testnet:', switchError);
        return false;
      }
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!web3auth.provider || !state.address) {
        throw new Error('Provider or address not available');
      }
      
      const web3 = new Web3(web3auth.provider as unknown as string);
      const signature = await web3.eth.personal.sign(message, state.address, '');
      return signature;
    } catch (error) {
      console.error('❌ [Web3Auth] Sign message error:', error);
      throw error;
    }
  };

  // opBNB Testnet Faucet 링크 제공
  const getTestBNB = () => {
    window.open(OPBNB_TESTNET.faucetUrl, '_blank');
  };

  const contextValue: Web3AuthContextType = {
    ...state,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    getChainId,
    getNetworkName,
    switchToOpBNBTestnet,
    signMessage,
    getTestBNB,
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = (): Web3AuthContextType => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};