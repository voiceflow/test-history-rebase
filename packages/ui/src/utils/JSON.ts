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
