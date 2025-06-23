import supabase from './client';
import { UserProfile, UserProfileInsert, UserProfileUpdate, MiningSession, MiningSessionInsert } from './types';

export class SupabaseAuthService {
  /**
   * Web3Auth 사용자를 Supabase에 등록 또는 업데이트
   */
  static async upsertUser(userData: {
    walletAddress: string;
    email?: string;
    name?: string;
    profileImage?: string;
    loginProvider: string;
    verifier?: string;
    verifierId?: string;
  }): Promise<UserProfile | null> {
    try {
      const userInsert: UserProfileInsert = {
        wallet_address: userData.walletAddress.toLowerCase(),
        email: userData.email,
        name: userData.name,
        profile_image: userData.profileImage,
        login_provider: userData.loginProvider,
        web3auth_verifier: userData.verifier,
        web3auth_verifier_id: userData.verifierId,
        last_login_at: new Date().toISOString(),
        is_active: true,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(userInsert, {
          onConflict: 'wallet_address',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [Supabase] 사용자 등록/업데이트 실패:', error);
        return null;
      }

      console.log('✅ [Supabase] 사용자 등록/업데이트 성공:', data);
      return data;
    } catch (error) {
      console.error('❌ [Supabase] 사용자 upsert 중 오류:', error);
      return null;
    }
  }

  /**
   * 지갑 주소로 사용자 조회
   */
  static async getUserByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 데이터가 없는 경우
          return null;
        }
        console.error('❌ [Supabase] 사용자 조회 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ [Supabase] 사용자 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateUserProfile(
    walletAddress: string, 
    updates: UserProfileUpdate
  ): Promise<UserProfile | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('wallet_address', walletAddress.toLowerCase())
        .select()
        .single();

      if (error) {
        console.error('❌ [Supabase] 사용자 프로필 업데이트 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ [Supabase] 사용자 프로필 업데이트 중 오류:', error);
      return null;
    }
  }

  /**
   * 사용자 로그인 시간 업데이트
   */
  static async updateLastLoginTime(walletAddress: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress.toLowerCase());

      if (error) {
        console.error('❌ [Supabase] 로그인 시간 업데이트 실패:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [Supabase] 로그인 시간 업데이트 중 오류:', error);
      return false;
    }
  }

  /**
   * 사용자 비활성화 (소프트 삭제)
   */
  static async deactivateUser(walletAddress: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress.toLowerCase());

      if (error) {
        console.error('❌ [Supabase] 사용자 비활성화 실패:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [Supabase] 사용자 비활성화 중 오류:', error);
      return false;
    }
  }
}

export class SupabaseMiningService {
  /**
   * 마이닝 세션 시작
   */
  static async startMiningSession(userId: string): Promise<MiningSession | null> {
    try {
      const sessionData: MiningSessionInsert = {
        user_id: userId,
        start_time: new Date().toISOString(),
        status: 'active',
        hash_rate: 15.2,
        efficiency: 87.3,
      };

      const { data, error } = await supabase
        .from('mining_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('❌ [Supabase] 마이닝 세션 시작 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ [Supabase] 마이닝 세션 시작 중 오류:', error);
      return null;
    }
  }

  /**
   * 마이닝 세션 종료
   */
  static async endMiningSession(sessionId: string, earnings: number): Promise<boolean> {
    try {
      const endTime = new Date().toISOString();
      
      const { error } = await supabase
        .from('mining_sessions')
        .update({
          end_time: endTime,
          earnings_bnb: earnings,
          status: 'completed',
        })
        .eq('id', sessionId);

      if (error) {
        console.error('❌ [Supabase] 마이닝 세션 종료 실패:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [Supabase] 마이닝 세션 종료 중 오류:', error);
      return false;
    }
  }

  /**
   * 활성 마이닝 세션 조회
   */
  static async getActiveMiningSession(userId: string): Promise<MiningSession | null> {
    try {
      const { data, error } = await supabase
        .from('mining_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('❌ [Supabase] 활성 마이닝 세션 조회 실패:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ [Supabase] 활성 마이닝 세션 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 사용자의 마이닝 히스토리 조회
   */
  static async getMiningHistory(userId: string, limit: number = 10): Promise<MiningSession[]> {
    try {
      const { data, error } = await supabase
        .from('mining_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ [Supabase] 마이닝 히스토리 조회 실패:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ [Supabase] 마이닝 히스토리 조회 중 오류:', error);
      return [];
    }
  }
}

export class SupabaseSessionService {
  /**
   * 세션 토큰 생성 (JWT 기반)
   */
  static async createSession(userData: UserProfile): Promise<string | null> {
    try {
      // Supabase에서 커스텀 세션 토큰 생성
      // 실제로는 JWT 라이브러리를 사용하거나 Supabase의 내장 인증을 활용
      const sessionData = {
        userId: userData.id,
        walletAddress: userData.wallet_address,
        email: userData.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7일 만료
      };

      // 여기서는 간단히 localStorage에 저장
      localStorage.setItem('supabase_session', JSON.stringify(sessionData));
      return JSON.stringify(sessionData);
    } catch (error) {
      console.error('❌ [Supabase] 세션 생성 중 오류:', error);
      return null;
    }
  }

  /**
   * 세션 검증
   */
  static validateSession(): UserProfile | null {
    try {
      const sessionData = localStorage.getItem('supabase_session');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // 만료 시간 체크
      if (session.exp && session.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('supabase_session');
        return null;
      }

      return session;
    } catch (error) {
      console.error('❌ [Supabase] 세션 검증 중 오류:', error);
      localStorage.removeItem('supabase_session');
      return null;
    }
  }

  /**
   * 세션 삭제
   */
  static clearSession(): void {
    localStorage.removeItem('supabase_session');
  }
}