interface MediaSize {
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

export const videoSizeFromUrl = async (url: string): Promise<MediaSize> =>
  new Promise<MediaSize>((resolve, reject) => {
    const video = document.createElement('video');

    video.onerror = reject;
    video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });

    video.src = url;
  });
