import ObjectId from 'bson-objectid';

export const objectID = () => new ObjectId().toHexString();
