import axios from 'axios';

import config from 'config';

export const uploadImage = (file, options = {}) => {
  const formData = new FormData();

  formData.append('file', file);

  Object.keys(options).forEach(key => formData.append(key, options[key]));

  return axios.post(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/upload`,
    formData
  );
};

export const addTransforms = (url, transforms) =>
  url.replace('/image/upload/', `/image/upload/${transforms}/`);
