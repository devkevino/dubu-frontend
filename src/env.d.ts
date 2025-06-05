/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEB3AUTH_CLIENT_ID: string;
    readonly VITE_WEB3AUTH_NETWORK: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_URL: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }