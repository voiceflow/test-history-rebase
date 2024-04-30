import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import type { MultiAdapter } from 'bidirectional-adapter';
import { identityAdapter } from 'bidirectional-adapter';
import moize from 'moize';

import type { AdapterContext } from '@/adapters/types';
import { BlockType } from '@/constants';
import type { NodeData } from '@/models';
import { createPlatformAndProjectTypeSelector, createPlatformSelector } from '@/utils/platform';

import { alexaBlockAdapter, alexaOutPortAdapter, alexaOutPortAdapterV2 } from './alexa';
import { baseBlockAdapter, baseOutPortAdapter, baseOutPortAdapterV2 } from './base';
import blockDataAdapter from './block';
import { chatBlockAdapter } from './chat';
import { dialogflowAdapter, dialogflowOutPortAdapter, dialogflowOutPortAdapterV2 } from './dialogflow';
import { generalBlockAdapter } from './general';
import invalidPlatformAdapter from './invalidPlatform';
import markupImageAdapter from './markupImage';
import markupTextAdapter from './markupText';
import markupVideoAdapter from './markupVideo';
import { migrationBlockAdapter } from './migration';
import startDataAdapter from './start';
import type { BlockAdapterOptions, FromDBBlockAdapterOptions, OutPortsAdapter, OutPortsAdapterV2 } from './utils';

export type { OutPortsAdapter, OutPortsAdapterV2 } from './utils';
export { defaultOutPortsAdapter, defaultOutPortsAdapterV2, removePortDataFalsyValues } from './utils';

const BLOCK_TYPE_MAPPING: [string, BlockType][] = [[BaseModels.BaseNodeType.BLOCK, BlockType.COMBINED]];

export const APP_BLOCK_TYPE_FROM_DB: Record<
  string,
  BlockType | ((data: BaseModels.BaseDiagramNode['data'], options: { context: AdapterContext }) => BlockType)
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
  [BaseNode.NodeType.API]: BlockType.INTEGRATION,
  [BaseNode.NodeType.IF]: BlockType.IFV2,
  [BaseNode.NodeType.SET]: BlockType.SETV2,
  [BaseNode.NodeType.CUSTOM_BLOCK_POINTER]: BlockType.CUSTOM_BLOCK_POINTER,
  [BlockType.DEPRECATED_CUSTOM_PAYLOAD]: BlockType.PAYLOAD,
};

export const DB_BLOCK_TYPE_FROM_APP: Partial<
  Record<BlockType, string | ((data: NodeData<any>, options: { context: AdapterContext }) => string)>
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [value]: key }), {}),
  [BlockType.INTEGRATION]: BaseNode.NodeType.API,
  [BaseNode.NodeType.IF]: BlockType.IFV2,
  [BaseNode.NodeType.SET]: BlockType.SETV2,
};

const getPlatformAdapter = createPlatformAndProjectTypeSelector<Partial<Record<BlockType, unknown>>>(
  {
    [Platform.Constants.PlatformType.ALEXA]: alexaBlockAdapter,
    [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.CHAT}`]: {
      ...chatBlockAdapter,
      ...dialogflowAdapter,
    },
    [`${Platform.Constants.PlatformType.DIALOGFLOW_ES}:${Platform.Constants.ProjectType.VOICE}`]: dialogflowAdapter,
    [Platform.Constants.ProjectType.CHAT]: chatBlockAdapter,
  },
  { ...baseBlockAdapter, ...generalBlockAdapter }
);

const commonBlockAdapter = {
  // internal
  [BlockType.START]: startDataAdapter,
  [BlockType.COMMENT]: null,
  [BlockType.ACTIONS]: identityAdapter.multi,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.DEPRECATED]: null,
  [BlockType.CHOICE_OLD]: null,
  [BlockType.INVALID_PLATFORM]: invalidPlatformAdapter,

  // markup
  [BlockType.MARKUP_TEXT]: markupTextAdapter,
  [BlockType.MARKUP_IMAGE]: markupImageAdapter,
  [BlockType.MARKUP_VIDEO]: markupVideoAdapter,
};

const getPlatformOutPortsAdapter = createPlatformSelector<
  typeof alexaOutPortAdapter | typeof baseOutPortAdapter | typeof dialogflowOutPortAdapter
>(
  {
    [Platform.Constants.PlatformType.ALEXA]: alexaOutPortAdapter,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: dialogflowOutPortAdapter,
  },
  baseOutPortAdapter
);

const getPlatformOutPortsAdapterV2 = createPlatformSelector<
  typeof alexaOutPortAdapterV2 | typeof baseOutPortAdapterV2 | typeof dialogflowOutPortAdapterV2
>(
  {
    [Platform.Constants.PlatformType.ALEXA]: alexaOutPortAdapterV2,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: dialogflowOutPortAdapterV2,
  },
  baseOutPortAdapterV2
);

export const noInPortTypes = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.EVENT, BlockType.START]);

type PlatformBlockAdapters = Partial<
  Record<BlockType, MultiAdapter<unknown, NodeData<unknown>, [FromDBBlockAdapterOptions], [BlockAdapterOptions]>>
>;

export const getBlockAdapters = moize(
  (
    platform: Platform.Constants.PlatformType,
    projectType: Platform.Constants.ProjectType,
    migrate?: boolean
  ): PlatformBlockAdapters => {
    if (migrate) {
      return migrationBlockAdapter as unknown as PlatformBlockAdapters;
    }

    return {
      ...commonBlockAdapter,
      ...baseBlockAdapter,
      ...generalBlockAdapter,
      ...getPlatformAdapter(platform, projectType),
    } as unknown as PlatformBlockAdapters;
  }
);

type PlatformOutPortAdapter = Partial<Record<BlockType, OutPortsAdapter>>;
type PlatformOutPortAdapterV2 = Partial<Record<BlockType, OutPortsAdapterV2>>;

export const getOutPortsAdapter = moize(
  (platform: Platform.Constants.PlatformType): PlatformOutPortAdapter =>
    ({
      ...baseOutPortAdapter,
      ...getPlatformOutPortsAdapter(platform),
    }) as PlatformOutPortAdapter
);

export const getOutPortsAdapterV2 = moize(
  (platform: Platform.Constants.PlatformType): PlatformOutPortAdapterV2 =>
    ({
      ...baseOutPortAdapterV2,
      ...getPlatformOutPortsAdapterV2(platform),
    }) as PlatformOutPortAdapterV2
);
