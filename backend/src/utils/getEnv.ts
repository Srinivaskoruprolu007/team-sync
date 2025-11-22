import { config } from "dotenv";

config();

export function getEnv(key: string, defaultValue?: string) {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value ?? defaultValue!;
}

export const env = {
    port: getEnv("PORT", "3000"),
    node_env: getEnv("NODE_ENV", "development"),
    mongo_uri: getEnv("MONGO_URI", "mongodb://localhost:27017"),
    session_secret: getEnv("SESSION_SECRET"),
    session_expiration: getEnv("SESSION_EXPIRES_IN", "1d"),
    google_client_id: getEnv("GOOGLE_CLIENT_ID", "google_client_id"),
    google_client_secret: getEnv("GOOGLE_CLIENT_SECRET", "google_client_secret"),
    google_callback_url: getEnv("GOOGLE_CALLBACK_URL"),
    frontend_url: getEnv("FRONTEND_URL"),
    frontend_fallback_url: getEnv("FRONTEND_FALLBACK_URL"),
    base_path: getEnv("BASE_PATH", "/api"),
};
