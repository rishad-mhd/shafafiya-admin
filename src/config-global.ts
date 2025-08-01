import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  baseUrl: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Elyzee',
  appVersion: packageJson.version,
  baseUrl: import.meta.env.VITE_BASE_URL,
};
