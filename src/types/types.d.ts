//Declare type for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      DATABASE_URL: string;
    }
  }
}
