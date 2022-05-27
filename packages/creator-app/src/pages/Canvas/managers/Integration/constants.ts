import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, SVG } from '@voiceflow/ui';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';

import { NodeConfig } from '../types';

export const getNameMap = (
  nameMapOverride?: Partial<Record<BaseNode.Utils.IntegrationType, string>>
): Record<BaseNode.Utils.IntegrationType, string> => ({
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'Zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'API',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'Google Sheets',
  ...nameMapOverride,
});

export const getIconMap = (
  iconMapOverride?: Partial<Record<BaseNode.Utils.IntegrationType, Icon>>
): Record<BaseNode.Utils.IntegrationType, Icon> => ({
  [BaseNode.Utils.IntegrationType.ZAPIER]: 'zapier',
  [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'variable',
  [BaseNode.Utils.IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
  ...iconMapOverride,
});

export const EMPTY_KEY_VALUE_ITEM = { key: '', val: '' };

export const getDefaultData = (
  defaultDataOverride?: Partial<Record<BaseNode.Utils.IntegrationType, Realtime.NodeData.Integration>>
): Record<BaseNode.Utils.IntegrationType, Realtime.NodeData.Integration> => ({
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
  ...defaultDataOverride,
});

export const DEFAULT_DATA = getDefaultData();
export const NAME_MAP = getNameMap();
export const ICON_MAP = getIconMap();

export const buildNodeConfig = ({
  iconMap,
  defaultData,
  nameMap,
}: {
  iconMap: Record<BaseNode.Utils.IntegrationType, Icon>;
  defaultData: Record<BaseNode.Utils.IntegrationType, Realtime.NodeData.Integration>;
  nameMap: Record<BaseNode.Utils.IntegrationType, string>;
}): NodeConfig<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> => ({
  type: BlockType.INTEGRATION,

  // for older version
  icon: SVG.globeIcon as any,

  // for block redesign
  getIcon: (data) => iconMap[data.selectedIntegration!],

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
      name: data?.selectedIntegration ? nameMap[data.selectedIntegration] : 'Integrations',
      ...data,
      ...(data && defaultData[data.selectedIntegration!]),
    } as Creator.DataDescriptor<Realtime.NodeData.Integration>,
  }),
});

export const NODE_CONFIG = buildNodeConfig({ iconMap: ICON_MAP, defaultData: DEFAULT_DATA, nameMap: NAME_MAP });
