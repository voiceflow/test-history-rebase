import { BaseDiagramNode } from '@voiceflow/api-sdk';
import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import moize from 'moize';

import { BlockType } from '../../../constants';
import { NodeData } from '../../../models';
import { createPlatformSelector } from '../../../utils/platform';
import { AdapterContext } from '../../types';
import { BidirectionalAdapter } from '../../utils';
import { alexaBlockAdapter, alexaPortsAdapter } from './alexa';
import blockDataAdapter from './block';
import { chatBlockAdapter } from './chat';
import { generalBlockAdapter, generalPortsAdapter } from './general';
import { googleBlockAdapter, googlePortsAdapter } from './google';
import invalidPlatformAdapter from './invalidPlatform';
import markupImageAdapter from './markupImage';
import markupTextAdapter from './markupText';
import { migrationBlockAdapter } from './migration';
import startDataAdapter from './start';
import { PortsAdapter } from './utils';

const BLOCK_TYPE_MAPPING: [string, BlockType][] = [['block', BlockType.COMBINED]];

export const APP_BLOCK_TYPE_FROM_DB: Record<
  string,
  BlockType | ((data: BaseDiagramNode['data'], options: { context: AdapterContext }) => BlockType)
> = {
  ...BLOCK_TYPE_MAPPING.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}),
  [Node.NodeType.API]: BlockType.INTEGRATION,
  [Node.NodeType.ZAPIER]: BlockType.INTEGRATION,
  [Node.NodeType.GOOGLE_SHEETS]: BlockType.INTEGRATION,
  [Node.NodeType.IF]: BlockType.IFV2,
  [Node.NodeType.SET]: BlockType.SETV2,
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
  },
  generalBlockAdapter
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

const getPlatformPortsAdapter = createPlatformSelector<typeof alexaPortsAdapter | typeof googlePortsAdapter | typeof generalPortsAdapter>(
  {
    [Constants.PlatformType.ALEXA]: alexaPortsAdapter,
    [Constants.PlatformType.GOOGLE]: googlePortsAdapter,
  },
  generalPortsAdapter
);

export const noInPortTypes = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.EVENT, BlockType.START]);

type PlatformBlockAdapter = Partial<
  Record<BlockType, BidirectionalAdapter<unknown, NodeData<unknown>, [{ context: AdapterContext }], [{ context: AdapterContext }]>>
>;

const commonPortsAdapter = {};

export const getBlockAdapter = moize((platform: Constants.PlatformType, migrate?: boolean): PlatformBlockAdapter => {
  if (migrate) {
    return migrationBlockAdapter as unknown as PlatformBlockAdapter;
  }

  return {
    ...commonBlockAdapter,
    ...generalBlockAdapter,
    ...getPlatformAdapter(platform),
  } as unknown as PlatformBlockAdapter;
});

type PlatformPortsAdapter = Partial<Record<BlockType, PortsAdapter>>;

export const getPortsAdapter = moize(
  (platform: Constants.PlatformType): PlatformPortsAdapter =>
    ({
      ...commonPortsAdapter,
      ...generalPortsAdapter,
      ...getPlatformPortsAdapter(platform),
    } as PlatformPortsAdapter)
);

export { defaultPortAdapter } from './utils';
