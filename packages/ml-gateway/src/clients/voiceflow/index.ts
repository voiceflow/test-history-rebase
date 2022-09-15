import * as Voiceflow from '@voiceflow/api-sdk';

import logger from '@/logger';

import { ExtraOptions, Options } from './types';
import ExtraUserClient, { UserClient } from './user';

export interface Client extends Voiceflow.Client {
  user: Voiceflow.Client['user'] & UserClient;
}

export type VoiceflowFactory = (token: string) => Client;

const VoiceflowFactoryClient = ({ axios, config }: Options): VoiceflowFactory => {
  // default.default is happening due to ESM modules
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const voiceflow = new (Voiceflow.default?.default ?? Voiceflow.default)({
    clientKey: 'realtime',
    apiEndpoint: `${config.CREATOR_API_ENDPOINT}/v2`,
  });

  return (token: string) => {
    const client: Voiceflow.Client = voiceflow.generateClient({ authorization: token });
    const api = axios.create({ baseURL: config.CREATOR_API_ENDPOINT, headers: { authorization: token } });

    const extraOptions: ExtraOptions = { config, api, log: logger };

    Object.assign(client.user, ExtraUserClient(extraOptions));

    return client as Client;
  };
};

export default VoiceflowFactoryClient;
