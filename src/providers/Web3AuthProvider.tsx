// src/providers/Web3AuthProvider.tsx (수정된 버전)
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { WALLET_ADAPTERS, ADAPTER_EVENTS, IProvider } from "@web3auth/base";
import Web3 from "web3";
import web3auth, { CURRENT_NETWORK } from '../lib/web3auth/config';
import { Web3AuthContextType, Web3AuthState, Web3AuthUser, LoginProvider } from '../types/web3auth.types';
import { SupabaseAuthService, SupabaseSessionService, SupabaseMiningService } from '../lib/supabase/services';
import { UserProfile } from '../lib/supabase/types';

// Ethereum RPC Error 타입 정의
interface EthereumRpcError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

// Provider 타입 확장
type Web3Provider = IProvider & {
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

// 확장된 상태 타입 (Supabase 정보 포함)
interface ExtendedWeb3AuthState extends Web3AuthState {
  supabaseUser: UserProfile | null;
  isSupabaseConnected: boolean;
}

// 확장된 컨텍스트 타입
interface ExtendedWeb3AuthContextType extends Web3AuthContextType {
  supabaseUser: UserProfile | null;
  isSupabaseConnected: boolean;
  refreshSupabaseUser: () => Promise<void>;
  startMiningSession: () => Promise<boolean>;
  endMiningSession: (sessionId: string, earnings: number) => Promise<boolean>;
}

const Web3AuthContext = createContext<ExtendedWeb3AuthContextType | null>(null);

interface Web3AuthProviderProps {
  children: ReactNode;
}

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<ExtendedWeb3AuthState>({
    isLoading: true,
    isConnected: false,
    user: null,
    provider: null,
    address: null,
    balance: null,
    chainId: null,
    networkName: null,
    supabaseUser: null,
    isSupabaseConnected: false,
  });

  // Supabase 사용자 정보 새로고침
  const refreshSupabaseUser = useCallback(async () => {
    if (!state.address) return;

    try {
      console.log('🔄 [Supabase] 사용자 정보 새로고침 중...');
      const supabaseUser = await SupabaseAuthService.getUserByWalletAddress(state.address);
      
      setState(prev => ({
        ...prev,
        supabaseUser,
        isSupabaseConnected: !!supabaseUser,
      }));

      console.log('✅ [Supabase] 사용자 정보 새로고침 완료:', supabaseUser ? '사용자 존재' : '사용자 없음');
    } catch (error) {
      console.error('❌ [Supabase] 사용자 정보 새로고침 실패:', error);
    }
  }, [state.address]);

  // Web3Auth 사용자를 Supabase에 동기화
  const syncUserToSupabase = useCallback(async (web3AuthUser: Web3AuthUser, walletAddress: string) => {
    try {
      console.log('🔄 [Supabase] 사용자 동기화 시작...');

      const userData = {
        walletAddress,
        email: web3AuthUser.email,
        name: web3AuthUser.name,
        profileImage: web3AuthUser.profileImage,
        loginProvider: web3AuthUser.typeOfLogin || 'unknown',
        verifier: web3AuthUser.verifier,
        verifierId: web3AuthUser.verifierId,
      };

      const supabaseUser = await SupabaseAuthService.upsertUser(userData);
      
      if (supabaseUser) {
        // 세션 생성
        await SupabaseSessionService.createSession(supabaseUser);
        
        setState(prev => ({
          ...prev,
          supabaseUser,
          isSupabaseConnected: true,
        }));

        console.log('✅ [Supabase] 사용자 동기화 성공');
        return supabaseUser;
      } else {
        console.error('❌ [Supabase] 사용자 동기화 실패');
        return null;
      }
    } catch (error) {
      console.error('❌ [Supabase] 사용자 동기화 중 오류:', error);
      return null;
    }
  }, []);

  const updateUserInfo = useCallback(async () => {
    try {
      console.log(`📊 [Web3Auth] Updating user info for ${CURRENT_NETWORK.displayName}...`);
      
      if (!web3auth.connected) {
        console.log('❌ [Web3Auth] Not connected, skipping user info update');
        return;
      }

      const user = await getUserInfo();
      const provider = web3auth.provider;
      const accounts = await getAccounts();
      const address = accounts[0] || null;
      const balance = address ? await getBalance(address) : null;
      const chainId = await getChainId();
      const networkName = await getNetworkName(chainId);

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

      setState((prev: ExtendedWeb3AuthState) => ({
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

      // localStorage에 사용자 정보 저장
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userAddress', address || '');
        localStorage.setItem('chainId', chainId?.toString() || '');
      }

      // Supabase에 사용자 동기화
      if (user && address) {
        await syncUserToSupabase(user, address);
      }

      // 네트워크 체크
      if (chainId !== CURRENT_NETWORK.chainId) {
        console.warn(`⚠️ [Web3Auth] Connected to wrong network. Expected ${CURRENT_NETWORK.displayName}.`);
      }
    } catch (error) {
      console.error('❌ [Web3Auth] Error updating user info:', error);
      setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: false }));
    }
  }, [syncUserToSupabase]);

  // 세션 복원 체크
  useEffect(() => {
    const checkExistingSession = () => {
      const sessionUser = SupabaseSessionService.validateSession();
      if (sessionUser) {
        console.log('🔄 [Supabase] 기존 세션 발견, 복원 중...');
        setState(prev => ({
          ...prev,
          supabaseUser: sessionUser,
          isSupabaseConnected: true,
        }));
      }
    };

    checkExistingSession();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        console.log(`🔄 [Web3Auth] Initializing for ${CURRENT_NETWORK.displayName}...`);
        setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: true }));
        
        await web3auth.initModal();
        console.log(`✅ [Web3Auth] Modal initialized for ${CURRENT_NETWORK.displayName}`);
        
        if (web3auth.connected) {
          console.log('🔗 [Web3Auth] Already connected, updating user info...');
          await updateUserInfo();
        } else {
          console.log('🚫 [Web3Auth] Not connected');
          setState((prev: ExtendedWeb3AuthState) => ({ 
            ...prev, 
            isLoading: false,
            networkName: CURRENT_NETWORK.displayName,
            chainId: CURRENT_NETWORK.chainId,
          }));
        }
      } catch (error) {
        console.error('❌ [Web3Auth] Initialization error:', error);
        setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: false }));
      }
    };

    init();
  }, [updateUserInfo]);

  useEffect(() => {
    const handleConnected = () => {
      console.log('🎉 [Web3Auth] Connected event fired');
      updateUserInfo();
    };

    const handleDisconnected = () => {
      console.log('👋 [Web3Auth] Disconnected event fired');
      
      // Supabase 세션도 정리
      SupabaseSessionService.clearSession();
      
      setState({
        isLoading: false,
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: null,
        chainId: CURRENT_NETWORK.chainId,
        networkName: CURRENT_NETWORK.displayName,
        supabaseUser: null,
        isSupabaseConnected: false,
      });
    };

    const handleConnecting = () => {
      console.log(`⏳ [Web3Auth] Connecting to ${CURRENT_NETWORK.displayName}...`);
      setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: true }));
    };

    web3auth.on(ADAPTER_EVENTS.CONNECTED, handleConnected);
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, handleDisconnected);
    web3auth.on(ADAPTER_EVENTS.CONNECTING, handleConnecting);

    return () => {
      web3auth.off(ADAPTER_EVENTS.CONNECTED, handleConnected);
      web3auth.off(ADAPTER_EVENTS.DISCONNECTED, handleDisconnected);
      web3auth.off(ADAPTER_EVENTS.CONNECTING, handleConnecting);
    };
  }, [updateUserInfo]);

  // 기존 Web3Auth 메서드들
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

  const getBalance = async (address?: string): Promise<string> => {
    try {
      if (!web3auth.provider || (!address && !state.address)) return '0';
      
      const targetAddress = address || state.address;
      if (!targetAddress) return '0';
      
      const web3 = new Web3(web3auth.provider as unknown as string);
      const balance = await web3.eth.getBalance(targetAddress);
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

  const getNetworkName = async (chainId?: number | null): Promise<string> => {
    try {
      const id = chainId !== undefined ? chainId : await getChainId();
      if (id === CURRENT_NETWORK.chainId) {
        return CURRENT_NETWORK.displayName;
      }
      return `Unknown Network (${id})`;
    } catch (error) {
      console.error('❌ [Web3Auth] Get network name error:', error);
      return 'Unknown Network';
    }
  };

  const login = async (loginProvider?: LoginProvider) => {
    try {
      console.log('🚪 [Web3Auth] Starting login with provider:', loginProvider);
      setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: true }));

      let provider: IProvider | null = null;

      if (loginProvider && loginProvider !== 'web3auth') {
        provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: loginProvider === 'email_passwordless' ? 'email_passwordless' : loginProvider,
        });
      } else {
        provider = await web3auth.connect();
      }

      if (provider) {
        console.log('🎉 [Web3Auth] Login successful, updating user info...');
        await updateUserInfo();
      } else {
        console.log('❌ [Web3Auth] Login failed - no provider returned');
        setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('❌ [Web3Auth] Login error:', error);
      setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 [Web3Auth] Starting logout...');
      setState((prev: ExtendedWeb3AuthState) => ({ ...prev, isLoading: true }));
      
      if (web3auth.connected) {
        await web3auth.logout();
      }
      
      // localStorage 및 Supabase 세션 정리
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('chainId');
      localStorage.removeItem('miningState');
      SupabaseSessionService.clearSession();
      
      console.log('✅ [Web3Auth] Logout completed');
      
      setState({
        isLoading: false,
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: null,
        chainId: CURRENT_NETWORK.chainId,
        networkName: CURRENT_NETWORK.displayName,
        supabaseUser: null,
        isSupabaseConnected: false,
      });
    } catch (error) {
      console.error('❌ [Web3Auth] Logout error:', error);
      setState({
        isLoading: false,
        isConnected: false,
        user: null,
        provider: null,
        address: null,
        balance: null,
        chainId: CURRENT_NETWORK.chainId,
        networkName: CURRENT_NETWORK.displayName,
        supabaseUser: null,
        isSupabaseConnected: false,
      });
      throw error;
    }
  };

  const switchToCurrentNetwork = async (): Promise<boolean> => {
    try {
      if (!web3auth.provider) {
        throw new Error('Provider not available');
      }

      const provider = web3auth.provider as Web3Provider;
      
      if (!provider.request) {
        console.error('❌ [Web3Auth] Provider does not support request method');
        return false;
      }

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CURRENT_NETWORK.chainIdHex }],
      });

      console.log(`✅ [Web3Auth] Switched to ${CURRENT_NETWORK.displayName}`);
      await updateUserInfo();
      return true;
    } catch (switchError) {
      const error = switchError as EthereumRpcError;
      
      if (error.code === 4902) {
        try {
          const provider = web3auth.provider as Web3Provider;
          
          if (!provider.request) {
            console.error('❌ [Web3Auth] Provider does not support request method');
            return false;
          }
          
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CURRENT_NETWORK.chainIdHex,
              chainName: CURRENT_NETWORK.displayName,
              rpcUrls: [CURRENT_NETWORK.rpcUrl],
              blockExplorerUrls: [CURRENT_NETWORK.blockExplorer],
              nativeCurrency: CURRENT_NETWORK.nativeCurrency,
            }],
          });

          console.log(`✅ [Web3Auth] Added and switched to ${CURRENT_NETWORK.displayName}`);
          await updateUserInfo();
          return true;
        } catch (addError) {
          console.error(`❌ [Web3Auth] Failed to add ${CURRENT_NETWORK.displayName}:`, addError);
          return false;
        }
      } else {
        console.error(`❌ [Web3Auth] Failed to switch to ${CURRENT_NETWORK.displayName}:`, error);
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

  const getTestBNB = () => {
    if (CURRENT_NETWORK.faucetUrl) {
      window.open(CURRENT_NETWORK.faucetUrl, '_blank');
    } else {
      console.warn('No faucet URL available for current network');
    }
  };

  // 마이닝 관련 Supabase 메서드들
  const startMiningSession = async (): Promise<boolean> => {
    try {
      if (!state.supabaseUser) {
        console.error('❌ [Mining] Supabase 사용자 정보가 없습니다');
        return false;
      }

      const session = await SupabaseMiningService.startMiningSession(state.supabaseUser.id);
      if (session) {
        console.log('✅ [Mining] 마이닝 세션 시작:', session);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ [Mining] 마이닝 세션 시작 실패:', error);
      return false;
    }
  };

  const endMiningSession = async (sessionId: string, earnings: number): Promise<boolean> => {
    try {
      const success = await SupabaseMiningService.endMiningSession(sessionId, earnings);
      if (success) {
        console.log('✅ [Mining] 마이닝 세션 종료 성공');
      }
      return success;
    } catch (error) {
      console.error('❌ [Mining] 마이닝 세션 종료 실패:', error);
      return false;
    }
  };

  const contextValue: ExtendedWeb3AuthContextType = {
    ...state,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    getChainId,
    getNetworkName,
    switchToOpBNBTestnet: switchToCurrentNetwork,
    signMessage,
    getTestBNB,
    refreshSupabaseUser,
    startMiningSession,
    endMiningSession,
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = (): ExtendedWeb3AuthContextType => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};