export const downloadFromURL = (filename: string, url: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadCSV = (filename: string, text: string) => {
  downloadFromURL(filename, `data:text/csv;encoding:utf-8',${encodeURIComponent(text)}`);
};

export const downloadText = (filename: string, text: string) => {
  downloadFromURL(filename, `data:text/plain;charset=utf-8',${encodeURIComponent(text)}`);
};

export const downloadJSON = (filename: string, text: string) => {
  downloadFromURL(filename, `data:text/json;charset=utf-8',${encodeURIComponent(text)}`);
};

export const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);

  downloadFromURL(filename, url);

  URL.revokeObjectURL(url);
};
