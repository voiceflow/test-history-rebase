import { AdapterContext } from '@realtime-sdk/adapters/types';
import { BlockType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { createPlatformSelector } from '@realtime-sdk/utils/platform';
import { Models as BaseModels, Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { BidirectionalAdapter } from 'bidirectional-adapter';
import moize from 'moize';

import { alexaBlockAdapter, alexaOutPortAdapter } from './alexa';
import { baseBlockAdapter, baseOutPortAdapter } from './base';
import blockDataAdapter from './block';
import { chatBlockAdapter } from './chat';
import { dialogflowAdapter, dialogflowOutPortAdapter } from './dialogflow';
import { generalBlockAdapter } from './general';
import { googleBlockAdapter, googleOutPortAdapter } from './google';
import invalidPlatformAdapter from './invalidPlatform';
import markupImageAdapter from './markupImage';
import markupTextAdapter from './markupText';
import { migrationBlockAdapter } from './migration';
import startDataAdapter from './start';
import { OutPortsAdapter } from './utils';

export type { OutPortsAdapter } from './utils';
export { defaultOutPortsAdapter, removePortDataFalsyValues } from './utils';

const BLOCK_TYPE_MAPPING: [string, BlockType][] = [['block', BlockType.COMBINED]];

export const APP_BLOCK_TYPE_FROM_DB: Record<
  string,
  BlockType | ((data: BaseModels.BaseDiagramNode['data'], options: { context: AdapterContext }) => BlockType)
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
  [Node.NodeType.API]: BlockType.INTEGRATION,
  [Node.NodeType.ZAPIER]: BlockType.INTEGRATION,
  [Node.NodeType.GOOGLE_SHEETS]: BlockType.INTEGRATION,
  [Node.NodeType.IF]: BlockType.IFV2,
  [Node.NodeType.SET]: BlockType.SETV2,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: BlockType.PAYLOAD,
};

export const DB_BLOCK_TYPE_FROM_APP: Partial<Record<BlockType, string | ((data: NodeData<any>, options: { context: AdapterContext }) => string)>> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [value]: key }), {}),
  [BlockType.INTEGRATION]: (data: NodeData<NodeData.Integration>) => {
    switch (data.selectedIntegration) {
      case Node.Utils.IntegrationType.ZAPIER:
        return Node.NodeType.ZAPIER;
      case Node.Utils.IntegrationType.GOOGLE_SHEETS:
        return Node.NodeType.GOOGLE_SHEETS;
      default:
        return Node.NodeType.API;
    }
  },
  [Node.NodeType.IF]: BlockType.IFV2,
  [Node.NodeType.SET]: BlockType.SETV2,
};

const getPlatformAdapter = createPlatformSelector<Partial<Record<BlockType, unknown>>>(
  {
    [Constants.PlatformType.ALEXA]: alexaBlockAdapter,
    [Constants.PlatformType.GOOGLE]: googleBlockAdapter,
    [Constants.PlatformType.CHATBOT]: chatBlockAdapter,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: dialogflowAdapter,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: dialogflowAdapter,
  },
  { ...baseBlockAdapter, ...generalBlockAdapter }
);

const commonBlockAdapter = {
  // internal
  [BlockType.START]: startDataAdapter,
  [BlockType.COMMENT]: null,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.DEPRECATED]: null,
  [BlockType.CHOICE_OLD]: null,
  [BlockType.INVALID_PLATFORM]: invalidPlatformAdapter,

  // markup
  [BlockType.MARKUP_TEXT]: markupTextAdapter,
  [BlockType.MARKUP_IMAGE]: markupImageAdapter,
};

const getPlatformOutPortsAdapter = createPlatformSelector<
  typeof alexaOutPortAdapter | typeof googleOutPortAdapter | typeof baseOutPortAdapter | typeof dialogflowOutPortAdapter
>(
  {
    [Constants.PlatformType.ALEXA]: alexaOutPortAdapter,
    [Constants.PlatformType.GOOGLE]: googleOutPortAdapter,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: dialogflowOutPortAdapter,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: dialogflowOutPortAdapter,
  },
  baseOutPortAdapter
);

export const noInPortTypes = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.EVENT, BlockType.START]);

type PlatformBlockAdapter = Partial<
  Record<BlockType, BidirectionalAdapter<unknown, NodeData<unknown>, [{ context: AdapterContext }], [{ context: AdapterContext }]>>
>;

export const getBlockAdapter = moize((platform: Constants.PlatformType, migrate?: boolean): PlatformBlockAdapter => {
  if (migrate) {
    return migrationBlockAdapter as unknown as PlatformBlockAdapter;
  }

  return {
    ...commonBlockAdapter,
    ...baseBlockAdapter,
    ...generalBlockAdapter,
    ...getPlatformAdapter(platform),
  } as unknown as PlatformBlockAdapter;
});

type PlatformOutPortAdapter = Partial<Record<BlockType, OutPortsAdapter>>;

export const getOutPortsAdapter = moize(
  (platform: Constants.PlatformType): PlatformOutPortAdapter =>
    ({
      ...baseOutPortAdapter,
      ...getPlatformOutPortsAdapter(platform),
    } as PlatformOutPortAdapter)
);
