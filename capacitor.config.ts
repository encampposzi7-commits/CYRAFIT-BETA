import type { CapacitorConfig } from '@capacitor/cli';

const liveReloadUrl = process.env.CAPACITOR_LIVE_RELOAD_URL?.trim();

const config: CapacitorConfig = {
  appId: 'app.lovable.cyrafit.beta',
  appName: 'Cyrafit',
  webDir: 'dist',
  ...(liveReloadUrl
    ? { server: { url: liveReloadUrl, cleartext: true } }
    : {}),
};

export default config;
