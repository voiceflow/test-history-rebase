export const readJSONFile = <T extends Record<string, unknown>>(
  file: File | Blob,
  fileReader: FileReader,
  requiredProps: string[] = []
): { data: T; fileName: string } => {
  const data = JSON.parse(fileReader.result as string) as T;

  requiredProps.forEach((propName) => {
    if (!data[propName]) {
      throw new Error('Unable to parse document.');
    }
  });

  return { data, fileName: file instanceof File ? file.name : 'Unknown' };
};

export const readCSVFile = async (file: File) => {
  const reader = new FileReader();

  const readFile = new Promise<string>((resolve, reject) => {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target === null || event.target.result === null) {
        reject(new Error("Couldn't get file result "));
        return;
      }

      resolve(event.target.result as string);
    };

    reader.onerror = reject;
  });

  reader.readAsText(file);

  const data = (await readFile)
    .split('\n')
    .map((part) => part.trim())
    .filter(Boolean);

  return { data, fileName: file instanceof File ? file.name : 'Unknown' };
};
