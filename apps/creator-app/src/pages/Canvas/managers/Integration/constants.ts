import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { NodeConfig } from '../types';

export const NAME_MAP: Record<BaseNode.Utils.IntegrationType, string> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'Zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'API',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'Google Sheets',
};

export const ICON_MAP: Record<BaseNode.Utils.IntegrationType, SvgIconTypes.Icon> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'integrations',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
};

export const DEFAULT_DATA: Record<BaseNode.Utils.IntegrationType, Realtime.NodeData.Integration> = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: {
    user: {},
    value: '',
    selectedAction: BaseNode.Zapier.ZapierActionType.START_A_ZAP,
    selectedIntegration: BaseNode.Utils.IntegrationType.ZAPIER,
  },
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: {
    url: '',
    body: [],
    headers: [],
    mapping: [],
    content: '',
    parameters: [],
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

export const TOOLTIP_TEXT_MAP = {
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'Pulls data from Zapier.',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'Makes custom API calls to external APIs and data.',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'Pulls data from a specified Google Sheet.',
};

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = {
  type: BlockType.INTEGRATION,

  getIcon: (data) => ICON_MAP[data.selectedIntegration!],

  getTooltipText: (data) => TOOLTIP_TEXT_MAP[data.selectedIntegration!],

  factory: (data) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
          },
        },
      },
    },
    data: {
      name: '',
      ...data,
      ...(data && DEFAULT_DATA[data.selectedIntegration!]),
    } as Creator.DataDescriptor<Realtime.NodeData.Integration>,
  }),
};
