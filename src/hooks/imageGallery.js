import { useEffect, useState } from 'react';
import api from 'utils/api';

export const useProjectImageGalleryFetcher = (projectId) => {
  const [images, setImages] = useState(null);

  useEffect(() => {
    api({ url: `projects/${projectId}/gallery_images.json` }).then(({ data }) => setImages(data.reverse()));
  }, [projectId]);

  return images;
};
