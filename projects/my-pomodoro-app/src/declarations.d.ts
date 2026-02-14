declare module "*.mp3";

interface Window {
  electronAPI?: {
    closeApp: () => void;
  };
}
