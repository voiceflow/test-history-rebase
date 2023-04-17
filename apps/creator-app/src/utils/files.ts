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
