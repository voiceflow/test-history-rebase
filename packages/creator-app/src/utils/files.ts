export const handleJSONFileRead = <T extends Record<string, unknown>>(
  file: File,
  fileReader: FileReader,
  requiredProps: string[] = []
): { data: T; fileName: string } => {
  const data = JSON.parse(fileReader.result as string) as T;

  requiredProps.forEach((propName) => {
    if (!data[propName]) {
      throw new Error('Unable to parse document.');
    }
  });

  return { data, fileName: file.name };
};

export const jsonToCSV = (data: object[]): string => {
  if (!data.length) return '';

  const keys = Object.keys(data[0]);

  return [
    `${keys.join(',')}`,
    ...data.map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
};
