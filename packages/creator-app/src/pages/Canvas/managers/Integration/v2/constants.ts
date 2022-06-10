import { BaseNode } from '@voiceflow/base-types';

import { buildNodeConfig, EMPTY_KEY_VALUE_ITEM, getDefaultData, getIconMap, getNameMap } from '../constants';

export const CUSTOM_API_NAME = 'API';

const NAME_MAP_V2 = getNameMap({ [BaseNode.Utils.IntegrationType.CUSTOM_API]: CUSTOM_API_NAME });

const ICON_MAP_V2 = getIconMap({ [BaseNode.Utils.IntegrationType.CUSTOM_API]: 'editor' });

const DEFAULT_DATA_V2 = getDefaultData({
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
});

export const expressionFactory = () => ({
  key: '',
  val: '',
});

export const mappingFactory = () => ({ path: '', var: null });

export const NODE_CONFIG_V2 = buildNodeConfig({ iconMap: ICON_MAP_V2, nameMap: NAME_MAP_V2, defaultData: DEFAULT_DATA_V2 });
