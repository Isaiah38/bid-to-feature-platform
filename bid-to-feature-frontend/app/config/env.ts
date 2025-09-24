const isDev = import.meta.env.MODE === 'development';

export const RPC_ENDPOINT = isDev
  ? (import.meta.env?.VITE_RPC_ENDPOINT_LOCAL ??
    process.env.VITE_RPC_ENDPOINT_LOCAL)
  : (import.meta.env.VITE_RPC_ENDPOINT_LIVE ??
    process.env.VITE_RPC_ENDPOINT_LIVE);

export const envConfig = {
  APP_URL: isDev ? 'http://localhost:5173' : '',
  RPC_ENDPOINT,
};
