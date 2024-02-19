const downloadFromURL = (filename: string, url: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);

  downloadFromURL(filename, url);

  URL.revokeObjectURL(url);
};
