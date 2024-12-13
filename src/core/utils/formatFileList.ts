type FileType = {
  name: string;
  flags: {
    encrypted: boolean;
    solid: boolean;
    directory: boolean;
  };
  packSize: number;
  unpSize: number;
  crc: number;
  time: string;
  unpVer: string;
  method: string;
  comment: string;
  fileType: string;
};

export type DirectoryType = {
  name: string;
  files: FileType[];
  directories: DirectoryType[];
};

export class FileListTransformer {
  transform(files: FileType[]): DirectoryType {
    const root: DirectoryType = { name: "root", files: [], directories: [] };

    function findOrCreateDirectory(path: string[], parent: DirectoryType): DirectoryType {
      const [current, ...rest] = path;

      let directory = parent.directories.find((dir) => dir.name === current);
      if (!directory) {
        directory = { name: current, files: [], directories: [] };
        parent.directories.push(directory);
      }

      if (rest.length === 0) {
        return directory;
      }

      return findOrCreateDirectory(rest, directory);
    }

    files.forEach((file) => {
      const parts = file.name.split("/");
      const isDirectory = file.flags.directory;

      if (isDirectory) {
        findOrCreateDirectory(parts, root);
      } else {
        const directoryPath = parts.slice(0, -1);
        const fileName = parts[parts.length - 1];
        const parentDir = findOrCreateDirectory(directoryPath, root);

        const fileExtensionMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
        const fileType = fileExtensionMatch ? fileExtensionMatch[1] : "";

        parentDir.files.push({
          ...file,
          name: fileName,
          fileType: fileType
        });
      }
    });

    return root;
  }
}
