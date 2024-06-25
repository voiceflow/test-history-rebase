import * as Voiceflow from '@voiceflow/api-sdk';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import type { DiagramClient } from './diagram';
import ExtraDiagramClient from './diagram';
import type { OrganizationClient } from './organization';
import ExtraOrganizationClient from './organization';
import ExtraProjectClient from './project';
import type { ThreadClient } from './thread';
import ExtraThreadClient from './thread';
import type { ExtraOptions, Options } from './types';
import type { UserClient } from './user';
import ExtraUserClient from './user';
import type { VariableStateClient } from './variableState';
import ExtraVariableStateClient from './variableState';
import ExtraVersionClient from './version';
import type { WorkspaceClient } from './workspace';
import ExtraWorkspaceClient from './workspace';

interface ExtraClient {
  organization: OrganizationClient;
  workspace: WorkspaceClient;
  thread: ThreadClient;
  identity: Realtime.Clients.Identity.V1Alpha1;
  billing: Realtime.Clients.Billing.Api;
}

export interface Client extends Voiceflow.Client, ExtraClient {
  user: Voiceflow.Client['user'] & UserClient;

  project: Voiceflow.Client['project'] & ReturnType<typeof ExtraProjectClient>;

  version: Voiceflow.Client['version'] & ReturnType<typeof ExtraVersionClient>;

  diagram: Voiceflow.Client['diagram'] & DiagramClient;

  variableState: Voiceflow.Client['variableState'] & VariableStateClient;
}

export type VoiceflowFactory = (token: string) => Client;

const VoiceflowFactoryClient = ({ axios, config, log }: Options): VoiceflowFactory => {
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
    const general = axios.create({ baseURL: config.GENERAL_SERVICE_ENDPOINT, headers: { authorization: token } });
    const identity = new Realtime.Clients.Identity.V1Alpha1({ baseURL: config.IDENTITY_API_ENDPOINT, token });
    const billing = new Realtime.Clients.Billing.Api({ baseURL: config.BILLING_API_ENDPOINT, token });

    const extraOptions: ExtraOptions = { config, api, alexa, general, log };

    const extraClient: ExtraClient = {
      organization: ExtraOrganizationClient(extraOptions),
      workspace: ExtraWorkspaceClient(extraOptions),
      thread: ExtraThreadClient(extraOptions),
      identity,
      billing,
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
