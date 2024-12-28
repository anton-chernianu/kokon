declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string[]>;
      filesList: (filePath: string) => Promise<{
        files: FileType[];
      }>;
      extractFile: (data: { filePath: string; password: string }) => Promise<{
        status: "success" | "error";
        message: string;
      }>;
      startDrag: (file: File) => Promise<{
        type: string;
        path: string;
      }>;
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      openDirectory: (filePath: string) => void;
      getSystemTheme: () => Promise<"dark" | "light">;
    };
  }

  module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
