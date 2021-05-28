import { DiagramNode } from '@voiceflow/api-sdk';
import { NodeType } from '@voiceflow/general-types';
import moize from 'moize';

import { BidirectionalAdapter } from '@/client/adapters/utils';
import { FeatureFlag } from '@/config/features';
import { BlockType, IntegrationType, PlatformType } from '@/constants';
import { FeatureFlagMap } from '@/ducks/feature';
import { NodeData } from '@/models';
import { createPlatformSelector } from '@/utils/platform';

import { alexaBlockAdapter, alexaPortsAdapter } from './alexa';
import blockDataAdapter from './block';
import { generalBlockAdapter, generalPortsAdapter } from './general';
import { googleBlockAdapter, googlePortsAdapter } from './google';
import invalidPlatformAdapter from './invalidPlatform';
import markupImageAdapter from './markupImage';
import markupTextAdapter from './markupText';
import { PortsAdapter } from './utils';

const BLOCK_TYPE_MAPPING: [string, BlockType][] = [['block', BlockType.COMBINED]];

export const APP_BLOCK_TYPE_FROM_DB: Record<
  string,
  BlockType | ((data: DiagramNode['data'], options: { features?: FeatureFlagMap }) => BlockType)
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
  [NodeType.API]: BlockType.INTEGRATION,
  [NodeType.ZAPIER]: BlockType.INTEGRATION,
  [NodeType.GOOGLE_SHEETS]: BlockType.INTEGRATION,
};

export const DB_BLOCK_TYPE_FROM_APP: Partial<
  Record<BlockType, string | ((data: NodeData<any>, options: { features?: FeatureFlagMap }) => string)>
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [value]: key }), {}),
  [BlockType.INTEGRATION]: (data: NodeData<NodeData.Integration>) => {
    switch (data.selectedIntegration) {
      case IntegrationType.ZAPIER:
        return NodeType.ZAPIER;
      case IntegrationType.GOOGLE_SHEETS:
        return NodeType.GOOGLE_SHEETS;
      default:
        return NodeType.API;
    }
  },
  [NodeType.IF]: (_, { features }) => (features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled ? BlockType.IFV2 : BlockType.IF),
  [NodeType.SET]: (_, { features }) => (features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled ? BlockType.SETV2 : BlockType.SET),
};

const getPlatformAdapter = createPlatformSelector<Partial<Record<BlockType, unknown>>>(
  {
    [PlatformType.ALEXA]: alexaBlockAdapter,
    [PlatformType.GOOGLE]: googleBlockAdapter,
  },
  generalBlockAdapter
);

const commonBlockAdapter = {
  // internal
  [BlockType.START]: blockDataAdapter,
  [BlockType.COMMENT]: null,
  [BlockType.COMBINED]: blockDataAdapter,
  [BlockType.DEPRECATED]: null,
  [BlockType.CHOICE_OLD]: null,
  [BlockType.INVALID_PLATFORM]: invalidPlatformAdapter,

  // markup
  [BlockType.MARKUP_TEXT]: markupTextAdapter,
  [BlockType.MARKUP_IMAGE]: markupImageAdapter,
};

const getPlatformPortsAdapter = createPlatformSelector<typeof alexaPortsAdapter | typeof googlePortsAdapter | typeof generalPortsAdapter>(
  {
    [PlatformType.ALEXA]: alexaPortsAdapter,
    [PlatformType.GOOGLE]: googlePortsAdapter,
  },
  generalPortsAdapter
);

export const noInPortTypes = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.EVENT, BlockType.START]);

type PlatformBlockAdapter = Partial<
  Record<BlockType, BidirectionalAdapter<unknown, NodeData<unknown>, [{ features: FeatureFlagMap }], [{ features: FeatureFlagMap }]>>
>;

const commonPortsAdapter = {};

export const getBlockAdapter = moize(
  (platform: PlatformType): PlatformBlockAdapter =>
    (({
      ...commonBlockAdapter,
      ...generalBlockAdapter,
      ...getPlatformAdapter(platform),
    } as unknown) as PlatformBlockAdapter)
);

type PlatformPortsAdapter = Partial<Record<BlockType, PortsAdapter>>;

export const getPortsAdapter = moize(
  (platform: PlatformType): PlatformPortsAdapter =>
    ({
      ...commonPortsAdapter,
      ...generalPortsAdapter,
      ...getPlatformPortsAdapter(platform),
    } as PlatformPortsAdapter)
);

export { defaultPortAdapter } from './utils';
