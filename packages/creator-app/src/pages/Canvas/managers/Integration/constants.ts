import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, SVG } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { NodeConfig } from '../types';

const NAME_MAP: Record<BaseNode.Utils.IntegrationType, string> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'Zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'API',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'Google Sheets',
};

const ICON_MAP: Record<BaseNode.Utils.IntegrationType, Icon> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'variable',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
};

const EMPTY_KEY_VALUE_ITEM = { key: '', val: '' };

export const DEFAULT_DATA: Record<BaseNode.Utils.IntegrationType, Realtime.NodeData.Integration> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: {
    user: {},
    value: '',
    selectedAction: BaseNode.Zapier.ZapierActionType.START_A_ZAP,
    selectedIntegration: BaseNode.Utils.IntegrationType.ZAPIER,
  },
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: {
    url: '',
    body: [EMPTY_KEY_VALUE_ITEM],
    headers: [EMPTY_KEY_VALUE_ITEM],
    mapping: [{ path: '', var: null }],
    content: '',
    parameters: [EMPTY_KEY_VALUE_ITEM],
    bodyInputType: BaseNode.Api.APIBodyType.FORM_DATA,
    selectedAction: BaseNode.Api.APIActionType.GET,
    selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API,
  },
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: {
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
    selectedIntegration: BaseNode.Utils.IntegrationType.GOOGLE_SHEETS,
  },
};
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = {
  type: BlockType.INTEGRATION,

  // for older version
  icon: SVG.globeIcon as any,

  // for block redesign
  getIcon: (data) => ICON_MAP[data.selectedIntegration!],

  factory: (data) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
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
