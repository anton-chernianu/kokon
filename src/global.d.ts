declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string[]>;
      filesList: (filePath: string) => Promise<{
        files: FileType[];
      }>;
      extractFile: (filePath: string) => Promise<string>;
      startDrag: (file: File) => Promise<{
        type: string;
        path: string;
      }>;
    };
  }

  module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
