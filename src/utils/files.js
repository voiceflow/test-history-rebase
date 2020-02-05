import { toast } from '@/componentsV2/Toast';

// eslint-disable-next-line import/prefer-default-export
export const handleJSONFileRead = async (file, fileReader, requiredProps = [], cb) => {
  const fileName = file.name;

  try {
    const data = JSON.parse(fileReader.result);
    requiredProps.forEach((propName) => {
      if (!data[propName]) {
        throw new Error('Unable to parse document');
      }
    });

    // eslint-disable-next-line callback-return
    cb(data, fileName);
  } catch (err) {
    toast.error('Invalid JSON Format');
  }
};
