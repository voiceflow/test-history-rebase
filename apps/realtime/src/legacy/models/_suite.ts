import { MongoDBContainer } from '@testcontainers/mongodb';
import { MongoClient } from 'mongodb';

const MONGO_VERSION = '7.0.8';

export type MongoDB = Awaited<ReturnType<typeof MongoDB>>;

export const MongoDB = async () => {
  const mongodb = await new MongoDBContainer(`mongo:${MONGO_VERSION}`).start();
  const client = await MongoClient.connect(`${mongodb.getConnectionString()}?directConnection=true`);

  const db = client.db('test');

  const stop = async () => {
    await client.close();
    await mongodb.stop();
  };

  return {
    db,
    stop,
  };
};
