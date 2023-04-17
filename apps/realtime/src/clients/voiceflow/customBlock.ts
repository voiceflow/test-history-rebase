import { BaseModels } from '@voiceflow/base-types';
import { Adapters, CustomBlock } from '@voiceflow/realtime-sdk/backend';

import { ExtraOptions } from './types';

export interface CustomBlockClient {
  create: (projectID: string, data: Omit<CustomBlock, 'id' | 'projectID'>) => Promise<CustomBlock>;
  readMany: (projectID: string) => Promise<CustomBlock[]>;
  read: (projectID: string, blockID: string) => Promise<CustomBlock>;
  update: (projectID: string, blockID: string, data: Omit<CustomBlock, 'id' | 'projectID'>) => Promise<Omit<CustomBlock, 'id'>>;
  delete: (projectID: string, blockID: string) => Promise<any>;
}

export const CUSTOM_BLOCKS_PATH = 'v2/projects';

const adaptToDB = (data: Omit<CustomBlock, 'id' | 'projectID'>) => {
  const { _id, projectID, ...rest } = Adapters.customBlockAdapter.toDB({ id: 'dummy', projectID: 'dummy', ...data });
  return rest;
};

const Client = ({ api }: ExtraOptions): CustomBlockClient => ({
  readMany: (projectID) =>
    api
      .get(`${CUSTOM_BLOCKS_PATH}/${projectID}/block`)
      .then(({ data }: { data: BaseModels.CustomBlock.Model[] }) => Adapters.customBlockAdapter.mapFromDB(data)),

  read: (projectID, blockID) =>
    api
      .get(`${CUSTOM_BLOCKS_PATH}/${projectID}/block/${blockID}`)
      .then(({ data }: { data: BaseModels.CustomBlock.Model }) => Adapters.customBlockAdapter.fromDB(data)),

  create: (projectID, data) =>
    api
      .post(`${CUSTOM_BLOCKS_PATH}/${projectID}/block`, adaptToDB(data))
      .then(({ data }: { data: BaseModels.CustomBlock.Model }) => Adapters.customBlockAdapter.fromDB(data)),

  update: (projectID, blockID, data) =>
    api
      .put(`${CUSTOM_BLOCKS_PATH}/${projectID}/block/${blockID}`, adaptToDB(data))
      .then(({ data }: { data: BaseModels.CustomBlock.Model }) => Adapters.customBlockAdapter.fromDB(data)),

  delete: (projectID, blockID) => api.delete(`${CUSTOM_BLOCKS_PATH}/${projectID}/block/${blockID}`),
});

export default Client;
