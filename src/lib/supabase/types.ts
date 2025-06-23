export interface Database {
    public: {
      Tables: {
        // 사용자 프로필 테이블
        user_profiles: {
          Row: {
            id: string;
            wallet_address: string;
            email?: string;
            name?: string;
            profile_image?: string;
            login_provider: string;
            web3auth_verifier?: string;
            web3auth_verifier_id?: string;
            created_at: string;
            updated_at: string;
            last_login_at?: string;
            is_active: boolean;
          };
          Insert: {
            id?: string;
            wallet_address: string;
            email?: string;
            name?: string;
            profile_image?: string;
            login_provider: string;
            web3auth_verifier?: string;
            web3auth_verifier_id?: string;
            created_at?: string;
            updated_at?: string;
            last_login_at?: string;
            is_active?: boolean;
          };
          Update: {
            id?: string;
            wallet_address?: string;
            email?: string;
            name?: string;
            profile_image?: string;
            login_provider?: string;
            web3auth_verifier?: string;
            web3auth_verifier_id?: string;
            created_at?: string;
            updated_at?: string;
            last_login_at?: string;
            is_active?: boolean;
          };
        };
        
        // 마이닝 세션 테이블
        mining_sessions: {
          Row: {
            id: string;
            user_id: string;
            start_time: string;
            end_time?: string;
            duration_seconds?: number;
            earnings_bnb?: number;
            hash_rate?: number;
            efficiency?: number;
            status: 'active' | 'completed' | 'cancelled';
            created_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            start_time?: string;
            end_time?: string;
            duration_seconds?: number;
            earnings_bnb?: number;
            hash_rate?: number;
            efficiency?: number;
            status?: 'active' | 'completed' | 'cancelled';
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            start_time?: string;
            end_time?: string;
            duration_seconds?: number;
            earnings_bnb?: number;
            hash_rate?: number;
            efficiency?: number;
            status?: 'active' | 'completed' | 'cancelled';
            created_at?: string;
          };
        };
  
        // 레퍼럴 테이블
        referrals: {
          Row: {
            id: string;
            referrer_id: string;
            referred_id: string;
            referral_code: string;
            commission_earned?: number;
            status: 'pending' | 'active' | 'completed';
            created_at: string;
          };
          Insert: {
            id?: string;
            referrer_id: string;
            referred_id: string;
            referral_code: string;
            commission_earned?: number;
            status?: 'pending' | 'active' | 'completed';
            created_at?: string;
          };
          Update: {
            id?: string;
            referrer_id?: string;
            referred_id?: string;
            referral_code?: string;
            commission_earned?: number;
            status?: 'pending' | 'active' | 'completed';
            created_at?: string;
          };
        };
  
        // 포인트/토큰 잔액 테이블
        user_balances: {
          Row: {
            id: string;
            user_id: string;
            token_type: 'bnb' | 'dubu' | 'usdt';
            balance: number;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            token_type: 'bnb' | 'dubu' | 'usdt';
            balance?: number;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            token_type?: 'bnb' | 'dubu' | 'usdt';
            balance?: number;
            updated_at?: string;
          };
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
    };
  }
  
  // 유용한 타입 정의
  export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
  export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
  export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
  
  export type MiningSession = Database['public']['Tables']['mining_sessions']['Row'];
  export type MiningSessionInsert = Database['public']['Tables']['mining_sessions']['Insert'];
  export type MiningSessionUpdate = Database['public']['Tables']['mining_sessions']['Update'];
  
  export type Referral = Database['public']['Tables']['referrals']['Row'];
  export type UserBalance = Database['public']['Tables']['user_balances']['Row'];