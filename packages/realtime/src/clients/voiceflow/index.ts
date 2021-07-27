/* eslint-disable new-cap */
import * as Voiceflow from '@voiceflow/api-sdk';

import ExtraDiagramClient, { DiagramClient } from './diagram';
import ExtraProjectClient, { ProjectClient } from './project';
import ExtraProjectListClient, { ProjectListClient } from './projectList';
import { ExtraOptions, Options } from './types';
import ExtraUserClient, { UserClient } from './user';
import ExtraVersionClient, { VersionClient } from './version';
import ExtraWorkspaceClient, { WorkspaceClient } from './workspace';

interface ExtraClient {
  workspace: WorkspaceClient;
  projectList: ProjectListClient;
}

export interface Client extends Voiceflow.Client, ExtraClient {
  user: Voiceflow.Client['user'] & UserClient;

  project: Voiceflow.Client['project'] & ProjectClient;

  version: Voiceflow.Client['version'] & VersionClient;

  diagram: Voiceflow.Client['diagram'] & DiagramClient;
}

export type VoiceflowFactory = (token: string) => Client;

const VoiceflowFactoryClient = ({ axios, config }: Options): VoiceflowFactory => {
  // default.default is happening due to ESM modules
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const voiceflow = new Voiceflow.default.default({ clientKey: 'realtime', apiEndpoint: `${config.CREATOR_API_ENDPOINT}/v2` });

  return (token: string) => {
    const client = voiceflow.generateClient({ authorization: token });
    const axiosClient = axios.create({ baseURL: config.CREATOR_API_ENDPOINT, headers: { authorization: token } });

    const extraOptions: ExtraOptions = { config, axiosClient };

    const extraClient: ExtraClient = {
      workspace: ExtraWorkspaceClient(extraOptions),
      projectList: ExtraProjectListClient(extraOptions),
    };

    Object.assign(client, extraClient);
    Object.assign(client.user, ExtraUserClient(extraOptions));
    Object.assign(client.project, ExtraProjectClient(extraOptions));
    Object.assign(client.version, ExtraVersionClient(extraOptions));
    Object.assign(client.diagram, ExtraDiagramClient(extraOptions));

    return client as Client;
  };
};

export default VoiceflowFactoryClient;
