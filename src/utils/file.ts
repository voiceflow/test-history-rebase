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
