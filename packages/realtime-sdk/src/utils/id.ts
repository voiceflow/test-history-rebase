import ObjectId from 'bson-objectid';

// eslint-disable-next-line import/prefer-default-export
export const objectID = () => new ObjectId().toHexString();
