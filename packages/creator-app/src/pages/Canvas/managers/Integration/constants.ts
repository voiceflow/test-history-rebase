import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, SVG } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { NodeConfig } from '../types';

const NAME_MAP: Record<Node.Utils.IntegrationType, string> = {
  [Node.Utils.IntegrationType.ZAPIER]: 'Zapier',
  [Node.Utils.IntegrationType.CUSTOM_API]: 'API',
  [Node.Utils.IntegrationType.GOOGLE_SHEETS]: 'Google Sheets',
};

const ICON_MAP: Record<Node.Utils.IntegrationType, Icon> = {
  [Node.Utils.IntegrationType.ZAPIER]: 'zapier',
  [Node.Utils.IntegrationType.CUSTOM_API]: 'variable',
  [Node.Utils.IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
};

const ICON_COLOR_MAP: Record<Node.Utils.IntegrationType, string> = {
  [Node.Utils.IntegrationType.ZAPIER]: '#e26d5a',
  [Node.Utils.IntegrationType.CUSTOM_API]: '#74a4bf',
  [Node.Utils.IntegrationType.GOOGLE_SHEETS]: '#279745',
};

const EMPTY_KEY_VALUE_ITEM = { key: '', val: '' };

export const DEFAULT_DATA: Record<Node.Utils.IntegrationType, Realtime.NodeData.Integration> = {
  [Node.Utils.IntegrationType.ZAPIER]: {
    user: {},
    value: '',
    selectedAction: Node.Zapier.ZapierActionType.START_A_ZAP,
    selectedIntegration: Node.Utils.IntegrationType.ZAPIER,
  },
  [Node.Utils.IntegrationType.CUSTOM_API]: {
    url: '',
    body: [EMPTY_KEY_VALUE_ITEM],
    headers: [EMPTY_KEY_VALUE_ITEM],
    mapping: [{ path: '', var: null }],
    content: '',
    parameters: [EMPTY_KEY_VALUE_ITEM],
    bodyInputType: Node.Api.APIBodyType.FORM_DATA,
    selectedAction: Node.Api.APIActionType.GET,
    selectedIntegration: Node.Utils.IntegrationType.CUSTOM_API,
  },
  [Node.Utils.IntegrationType.GOOGLE_SHEETS]: {
    user: {},
    sheet: null,
    mapping: [],
    end_row: '',
    start_row: '',
    row_values: [],
    row_number: '',
    match_value: '',
    spreadsheet: null,
    header_column: null,
    selectedAction: '',
    selectedIntegration: Node.Utils.IntegrationType.GOOGLE_SHEETS,
  },
};
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = {
  type: BlockType.INTEGRATION,

  // for older version
  icon: SVG.globeIcon as any,
  iconColor: '#fa7891',

  // for block redesign
  getIcon: (data) => ICON_MAP[data.selectedIntegration!],
  getIconColor: (data) => ICON_COLOR_MAP[data.selectedIntegration!],

  factory: (data) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: {
            [Models.PortType.NEXT]: { label: Models.PortType.NEXT },
            [Models.PortType.FAIL]: { label: Models.PortType.FAIL },
          },
        },
      },
    },
    data: {
      name: data?.selectedIntegration ? NAME_MAP[data.selectedIntegration] : 'Integrations',
      ...data,
      ...(data && DEFAULT_DATA[data.selectedIntegration!]),
    } as Creator.DataDescriptor<Realtime.NodeData.Integration>,
  }),
};
