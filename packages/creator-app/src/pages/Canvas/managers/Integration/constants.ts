import { Node } from '@voiceflow/base-types';
import { Icon, SVG } from '@voiceflow/ui';

import { BlockType, IntegrationType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

const NAME_MAP: Record<IntegrationType, string> = {
  [IntegrationType.ZAPIER]: 'Zapier',
  [IntegrationType.CUSTOM_API]: 'API',
  [IntegrationType.GOOGLE_SHEETS]: 'Google Sheets',
};

const ICON_MAP: Record<IntegrationType, Icon> = {
  [IntegrationType.ZAPIER]: 'zapier',
  [IntegrationType.CUSTOM_API]: 'variable',
  [IntegrationType.GOOGLE_SHEETS]: 'googleSheets',
};

const ICON_COLOR_MAP: Record<IntegrationType, string> = {
  [IntegrationType.ZAPIER]: '#e26d5a',
  [IntegrationType.CUSTOM_API]: '#74a4bf',
  [IntegrationType.GOOGLE_SHEETS]: '#279745',
};

const EMPTY_KEY_VALUE_ITEM = { key: '', val: '' };

export const DEFAULT_DATA: Record<IntegrationType, NodeData.Integration> = {
  [IntegrationType.ZAPIER]: {
    user: {},
    value: '',
    selectedAction: Node.Zapier.ZapierActionType.START_A_ZAP,
    selectedIntegration: IntegrationType.ZAPIER,
  },
  [IntegrationType.CUSTOM_API]: {
    url: '',
    body: [EMPTY_KEY_VALUE_ITEM],
    headers: [EMPTY_KEY_VALUE_ITEM],
    mapping: [{ path: '', var: null }],
    content: '',
    parameters: [EMPTY_KEY_VALUE_ITEM],
    bodyInputType: Node.Api.APIBodyType.FORM_DATA,
    selectedAction: Node.Api.APIActionType.GET,
    selectedIntegration: IntegrationType.CUSTOM_API,
  },
  [IntegrationType.GOOGLE_SHEETS]: {
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
    selectedIntegration: IntegrationType.GOOGLE_SHEETS,
  },
};
export const NODE_CONFIG: NodeConfig<NodeData.Integration> = {
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
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: data?.selectedIntegration ? NAME_MAP[data.selectedIntegration] : 'Integrations',
      ...data,
      ...(data && DEFAULT_DATA[data.selectedIntegration!]),
    } as Creator.DataDescriptor<NodeData.Integration>,
  }),
};
