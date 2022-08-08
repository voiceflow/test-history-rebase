import { AlexaVersion } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.AccountLinking, Realtime.NodeData.AccountLinkingBuiltInPorts> = {
  type: BlockType.ACCOUNT_LINKING,
  icon: 'link',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Account Linking',
    },
  }),
};

export const TABS = [
  {
    value: 'client',
    label: 'client',
  },
  {
    value: 'scope',
    label: 'scope',
  },
  {
    value: 'domain',
    label: 'domain',
  },
];

export const CLIENT_AUTH_SCHEMES = [
  { value: AlexaVersion.AccountLinkingAccessTokenScheme.HTTP_BASIC, label: 'HTTP Basic (recommended)' },
  { value: AlexaVersion.AccountLinkingAccessTokenScheme.REQUEST_BODY_CREDENTIALS, label: 'Credentials in request body' },
];

export const EMPTY_ACCOUNT_DATA: AlexaVersion.AccountLinking = {
  type: AlexaVersion.AccountLinkingType.AUTH_CODE,
  scopes: [''],
  domains: [''],
  clientId: '',
  clientSecret: '',
  accessTokenUrl: '',
  authorizationUrl: '',
  accessTokenScheme: AlexaVersion.AccountLinkingAccessTokenScheme.HTTP_BASIC,
  defaultTokenExpirationInSeconds: 3600,
};

export const HELP_LINK = 'https://www.voiceflow.com/docs';
