function readPublicEnv(name: string) {
  const value = import.meta.env[name as keyof ImportMetaEnv];
  return typeof value === "string" ? value.trim() : "";
}

function getRequiredPublicEnv(name: string) {
  const value = readPublicEnv(name);
  if (!value) {
    console.error(`[public-config] Missing required env: ${name}`);
  }
  return value;
}

export function getBackgroundRemovalWebhookUrl() {
  return getRequiredPublicEnv("VITE_REMOVE_BACKGROUND_WEBHOOK_URL");
}

export function getPurchaseWebhookUrl() {
  return getRequiredPublicEnv("VITE_PURCHASE_WEBHOOK_URL");
}

export function getPublicAppUrl() {
  const configuredAppUrl = readPublicEnv("VITE_APP_URL");
  if (configuredAppUrl) {
    return configuredAppUrl;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}
