declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string[]>;
      extractFile: (filePath: string) => Promise<string>;
    };
  }
}

export {};
