export const imageSizeFromFile = async (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();

    img.onerror = reject;
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.src = window.URL.createObjectURL(file);
  });

export const imageSizeFromUrl = async (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();

    img.onerror = reject;

    // eslint-disable-next-line sonarjs/no-identical-functions
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.src = url;
  });

export const readFileAsText = (file: File) => {
  const reader = new FileReader();

  const promise = new Promise<string>((resolve, reject) => {
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

  return promise;
};
