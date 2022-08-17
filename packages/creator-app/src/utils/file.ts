export interface MediaSize {
  width: number;
  height: number;
}

export const imageSizeFromUrl = async (url: string): Promise<MediaSize> =>
  new Promise<MediaSize>((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;

    img.src = url;
  });

export const imageSizeFromFile = async (file: File): Promise<MediaSize> => {
  const url = window.URL.createObjectURL(file);

  try {
    return await imageSizeFromUrl(url);
  } finally {
    window.URL.revokeObjectURL(url);
  }
};

export const videoSizeFromUrl = async (url: string): Promise<MediaSize> =>
  new Promise<MediaSize>((resolve, reject) => {
    const video = document.createElement('video');

    video.onerror = reject;
    video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });

    video.src = url;
  });

export const videoSizeFromFile = async (file: File): Promise<MediaSize> => {
  const url = window.URL.createObjectURL(file);

  try {
    return await videoSizeFromUrl(url);
  } finally {
    window.URL.revokeObjectURL(url);
  }
};

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
