import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sqlite-electron',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      electronWindowsLocation: 'C:\\Users\\veera',
    },
  },
};

export default config;
