interface AppConfig {
  apiBaseUrl: string;
}

let config: AppConfig | null = null;

export const loadConfig = async (): Promise<AppConfig> => {
  if (config) {
    return config;
  }

  try {
    const response = await fetch("/config.json");
    config = await response.json();
    return config as AppConfig;
  } catch (error) {
    console.error("Failed to load config.json, using defaults:", error);
    // Fallback to default configuration
    config = {
      apiBaseUrl: "https://YOUR_DEFAULT_API_URL.com",
    };
    return config;
  }
};

export const getConfig = (): AppConfig => {
  if (!config) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }
  return config;
};
