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

export const jsonToCSV = <T extends Record<string, string>[]>(data: T): string => {
  if (!data.length) return '';
  const keys = Object.keys(data[0]);
  let csvData = `${keys.join(',')}\n`;
  data.forEach((row) => {
    const rowData = Object.values(row).map((strData) => `"${strData.replace(/"/g, '""')}"`);
    csvData += rowData.join(',');
    csvData += '\n';
  });
  return csvData;
};
