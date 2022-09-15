import * as Voiceflow from '@voiceflow/api-sdk';

import logger from '@/logger';

import ExtraDiagramClient, { DiagramClient } from './diagram';
import ExtraFeatureClient, { FeatureClient } from './feature';
import ExtraProductClient, { ProductClient } from './product';
import ExtraProjectClient from './project';
import ExtraProjectListClient, { ProjectListClient } from './projectList';
import ExtraThreadClient, { ThreadClient } from './thread';
import { ExtraOptions, Options } from './types';
import ExtraUserClient, { UserClient } from './user';
import ExtraVariableStateClient, { VariableStateClient } from './variableState';
import ExtraVersionClient from './version';
import ExtraWorkspaceClient, { WorkspaceClient } from './workspace';

interface ExtraClient {
  workspace: WorkspaceClient;
  projectList: ProjectListClient;
  product: ProductClient;
  feature: FeatureClient;
  thread: ThreadClient;
}

export interface Client extends Voiceflow.Client, ExtraClient {
  user: Voiceflow.Client['user'] & UserClient;

  project: Voiceflow.Client['project'] & ReturnType<typeof ExtraProjectClient>;

  version: Voiceflow.Client['version'] & ReturnType<typeof ExtraVersionClient>;

  diagram: Voiceflow.Client['diagram'] & DiagramClient;

  variableState: Voiceflow.Client['variableState'] & VariableStateClient;
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
    const alexa = axios.create({ baseURL: config.ALEXA_SERVICE_ENDPOINT, headers: { authorization: token } });
    const google = axios.create({ baseURL: config.GOOGLE_SERVICE_ENDPOINT, headers: { authorization: token } });
    const dialogflow = axios.create({ baseURL: config.DIALOGFLOW_SERVICE_ENDPOINT, headers: { authorization: token } });
    const general = axios.create({ baseURL: config.GENERAL_SERVICE_ENDPOINT, headers: { authorization: token } });

    const extraOptions: ExtraOptions = { config, api, alexa, google, dialogflow, general, log: logger };

    const extraClient: ExtraClient = {
      workspace: ExtraWorkspaceClient(extraOptions),
      projectList: ExtraProjectListClient(extraOptions),
      product: ExtraProductClient(extraOptions),
      feature: ExtraFeatureClient(extraOptions),
      thread: ExtraThreadClient(extraOptions),
    };

    Object.assign(client, extraClient);
    Object.assign(client.user, ExtraUserClient(extraOptions));
    Object.assign(client.project, ExtraProjectClient(extraOptions));
    Object.assign(client.version, ExtraVersionClient(extraOptions));
    Object.assign(client.diagram, ExtraDiagramClient(extraOptions));
    Object.assign(client.variableState, ExtraVariableStateClient(extraOptions));

    return client as Client;
  };
};

export default VoiceflowFactoryClient;
