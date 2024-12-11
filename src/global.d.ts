declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string[]>;
      extractFile: (filePath: string) => Promise<string>;
      startDrag: (file: File) => Promise<string>;
    };
  }

  module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
