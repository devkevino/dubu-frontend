import { UserProfile, MiningSession } from './types';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface EdgeFunctionOptions {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
}

class EdgeFunctionClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace('/rest/v1', '') || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  }

  // Web3Auth 기반 인증 헤더 생성 (Base64 인코딩 사용)
  private getAuthHeaders(walletAddress?: string, signature?: string, message?: string) {
    const headers: Record<string, string> = { ...this.defaultHeaders };
    
    if (walletAddress && signature && message) {
      try {
        // Base64 인코딩을 사용하여 특수 문자 문제 해결
        headers['X-Wallet-Address'] = btoa(encodeURIComponent(walletAddress));
        headers['X-Signature'] = btoa(encodeURIComponent(signature));
        headers['X-Message'] = btoa(encodeURIComponent(message));
        headers['X-Encoded'] = 'base64'; // 인코딩 방식 표시
      } catch (error) {
        console.error('❌ [EdgeClient] 헤더 인코딩 실패:', error);
        // 폴백: URL 인코딩만 사용
        headers['X-Wallet-Address'] = encodeURIComponent(walletAddress);
        headers['X-Signature'] = encodeURIComponent(signature);
        headers['X-Message'] = encodeURIComponent(message);
        headers['X-Encoded'] = 'url'; // 인코딩 방식 표시
      }
    }

    return headers;
  }

  // Edge Function 호출
  protected async callEdgeFunction<T>(
    functionName: string,
    path: string = '',
    options: EdgeFunctionOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/functions/v1/${functionName}${path ? `/${path}` : ''}`;
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ [EdgeClient] ${functionName}/${path} 호출 실패:`, error);
      throw error;
    }
  }

  // 인증된 요청을 위한 헬퍼 메서드
  protected async callAuthenticatedEdgeFunction<T>(
    functionName: string,
    path: string = '',
    options: EdgeFunctionOptions = {},
    authData?: { walletAddress: string; signature: string; message: string }
  ): Promise<ApiResponse<T>> {
    const headers = authData ? 
      this.getAuthHeaders(authData.walletAddress, authData.signature, authData.message) :
      this.defaultHeaders;

    return this.callEdgeFunction<T>(functionName, path, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  }
}

// 사용자 관련 API 클라이언트
export class EdgeUserService extends EdgeFunctionClient {
  /**
   * 사용자 등록/업데이트
   */
  async upsertUser(
    userData: {
      walletAddress: string;
      email?: string;
      name?: string;
      profileImage?: string;
      loginProvider: string;
      verifier?: string;
      verifierId?: string;
    },
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<UserProfile | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<UserProfile>(
        'users',
        'upsert',
        {
          method: 'POST',
          body: userData,
        },
        authData
      );

      if (response.success && response.data) {
        console.log('✅ [EdgeUser] 사용자 등록/업데이트 성공:', response.data);
        return response.data;
      }

      console.error('❌ [EdgeUser] 사용자 등록/업데이트 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeUser] 사용자 upsert 중 오류:', error);
      return null;
    }
  }

  /**
   * 지갑 주소로 사용자 조회
   */
  async getUserByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
    try {
      const response = await this.callEdgeFunction<UserProfile>(
        'users',
        `profile?address=${encodeURIComponent(walletAddress)}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      if (response.error?.includes('찾을 수 없습니다')) {
        return null; // 사용자가 없는 경우
      }

      console.error('❌ [EdgeUser] 사용자 조회 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeUser] 사용자 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 내 프로필 조회 (인증 필요)
   */
  async getMyProfile(
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<UserProfile | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<UserProfile>(
        'users',
        'me',
        { method: 'GET' },
        authData
      );

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ [EdgeUser] 내 프로필 조회 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeUser] 내 프로필 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 프로필 업데이트
   */
  async updateUserProfile(
    updates: Partial<UserProfile>,
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<UserProfile | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<UserProfile>(
        'users',
        'profile',
        {
          method: 'PUT',
          body: updates,
        },
        authData
      );

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ [EdgeUser] 프로필 업데이트 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeUser] 프로필 업데이트 중 오류:', error);
      return null;
    }
  }

  /**
   * 로그인 시간 업데이트
   */
  async updateLastLoginTime(
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<boolean> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<boolean>(
        'users',
        'login-time',
        { method: 'PUT' },
        authData
      );

      if (response.success) {
        return true;
      }

      console.error('❌ [EdgeUser] 로그인 시간 업데이트 실패:', response.error);
      return false;
    } catch (error) {
      console.error('❌ [EdgeUser] 로그인 시간 업데이트 중 오류:', error);
      return false;
    }
  }

  /**
   * 사용자 비활성화
   */
  async deactivateUser(
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<boolean> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<boolean>(
        'users',
        'deactivate',
        { method: 'DELETE' },
        authData
      );

      if (response.success) {
        return true;
      }

      console.error('❌ [EdgeUser] 사용자 비활성화 실패:', response.error);
      return false;
    } catch (error) {
      console.error('❌ [EdgeUser] 사용자 비활성화 중 오류:', error);
      return false;
    }
  }
}

// 마이닝 관련 API 클라이언트
export class EdgeMiningService extends EdgeFunctionClient {
  /**
   * 마이닝 세션 시작
   */
  async startMiningSession(
    userId: string,
    authData: { walletAddress: string; signature: string; message: string },
    hashRate?: number,
    efficiency?: number
  ): Promise<MiningSession | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<MiningSession>(
        'mining',
        'start',
        {
          method: 'POST',
          body: {
            hash_rate: hashRate,
            efficiency: efficiency,
          },
        },
        authData
      );

      if (response.success && response.data) {
        console.log('✅ [EdgeMining] 마이닝 세션 시작 성공:', response.data);
        return response.data;
      }

      console.error('❌ [EdgeMining] 마이닝 세션 시작 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeMining] 마이닝 세션 시작 중 오류:', error);
      return null;
    }
  }

  /**
   * 마이닝 세션 종료
   */
  async endMiningSession(
    sessionId: string,
    earnings: number,
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<boolean> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<MiningSession>(
        'mining',
        'end',
        {
          method: 'POST',
          body: {
            session_id: sessionId,
            earnings_bnb: earnings,
          },
        },
        authData
      );

      if (response.success) {
        console.log('✅ [EdgeMining] 마이닝 세션 종료 성공');
        return true;
      }

      console.error('❌ [EdgeMining] 마이닝 세션 종료 실패:', response.error);
      return false;
    } catch (error) {
      console.error('❌ [EdgeMining] 마이닝 세션 종료 중 오류:', error);
      return false;
    }
  }

  /**
   * 활성 마이닝 세션 조회
   */
  async getActiveMiningSession(
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<MiningSession | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<MiningSession>(
        'mining',
        'active',
        { method: 'GET' },
        authData
      );

      if (response.success) {
        return response.data || null;
      }

      console.error('❌ [EdgeMining] 활성 마이닝 세션 조회 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeMining] 활성 마이닝 세션 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 마이닝 히스토리 조회
   */
  async getMiningHistory(
    authData: { walletAddress: string; signature: string; message: string },
    limit: number = 10,
    offset: number = 0,
    status?: 'active' | 'completed' | 'cancelled'
  ): Promise<MiningSession[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await this.callAuthenticatedEdgeFunction<MiningSession[]>(
        'mining',
        `history?${params.toString()}`,
        { method: 'GET' },
        authData
      );

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ [EdgeMining] 마이닝 히스토리 조회 실패:', response.error);
      return [];
    } catch (error) {
      console.error('❌ [EdgeMining] 마이닝 히스토리 조회 중 오류:', error);
      return [];
    }
  }

  /**
   * 마이닝 통계 조회
   */
  async getMiningStats(
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<{
    totalSessions: number;
    totalEarnings: number;
    averageEfficiency: number;
    averageHashRate: number;
    totalMiningTime: number;
  } | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<any>(
        'mining',
        'stats',
        { method: 'GET' },
        authData
      );

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ [EdgeMining] 마이닝 통계 조회 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeMining] 마이닝 통계 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 마이닝 세션 업데이트
   */
  async updateMiningSession(
    sessionId: string,
    updates: { hash_rate?: number; efficiency?: number },
    authData: { walletAddress: string; signature: string; message: string }
  ): Promise<MiningSession | null> {
    try {
      const response = await this.callAuthenticatedEdgeFunction<MiningSession>(
        'mining',
        'update',
        {
          method: 'PUT',
          body: {
            session_id: sessionId,
            ...updates,
          },
        },
        authData
      );

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ [EdgeMining] 마이닝 세션 업데이트 실패:', response.error);
      return null;
    } catch (error) {
      console.error('❌ [EdgeMining] 마이닝 세션 업데이트 중 오류:', error);
      return null;
    }
  }
}

// 기본 서비스 인스턴스 생성 및 내보내기
export const edgeUserService = new EdgeUserService();
export const edgeMiningService = new EdgeMiningService();

// 세션 관리를 위한 Edge 기반 서비스
export class EdgeSessionService {
  /**
   * 세션 토큰 생성 (Web3Auth 기반)
   */
  static async createSession(userData: UserProfile, authData: { walletAddress: string; signature: string; message: string }): Promise<string | null> {
    try {
      // Web3Auth 기반 세션은 지갑 서명으로 관리
      const sessionData = {
        userId: userData.id,
        walletAddress: userData.wallet_address,
        email: userData.email,
        signature: authData.signature,
        message: authData.message,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7일 만료
      };

      localStorage.setItem('edge_session', JSON.stringify(sessionData));
      return JSON.stringify(sessionData);
    } catch (error) {
      console.error('❌ [EdgeSession] 세션 생성 중 오류:', error);
      return null;
    }
  }

  /**
   * 세션 검증
   */
  static validateSession(): { userId: string; walletAddress: string; signature: string; message: string } | null {
    try {
      const sessionData = localStorage.getItem('edge_session');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // 만료 시간 체크
      if (session.exp && session.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('edge_session');
        return null;
      }

      return {
        userId: session.userId,
        walletAddress: session.walletAddress,
        signature: session.signature,
        message: session.message,
      };
    } catch (error) {
      console.error('❌ [EdgeSession] 세션 검증 중 오류:', error);
      localStorage.removeItem('edge_session');
      return null;
    }
  }

  /**
   * 세션 삭제
   */
  static clearSession(): void {
    localStorage.removeItem('edge_session');
  }

  /**
   * 현재 세션 기반 인증 데이터 가져오기
   */
  static getAuthData(): { walletAddress: string; signature: string; message: string } | null {
    const session = this.validateSession();
    if (!session) return null;

    return {
      walletAddress: session.walletAddress,
      signature: session.signature,
      message: session.message,
    };
  }
}