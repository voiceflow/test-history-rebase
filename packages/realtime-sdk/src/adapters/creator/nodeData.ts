import { BlockType } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter } from 'bidirectional-adapter';

import { AdapterContext } from '../types';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP, getBlockAdapters } from './block';
import { needsMigration } from './utils';

const nodeDataAdapter = createSimpleAdapter<
  { data: BaseModels.BaseDiagramNode['data']; type: string },
  NodeData<unknown>,
  [{ platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType; nodeID: string; context: AdapterContext }],
  [{ platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType; context: AdapterContext }]
>(
  ({ data: dbData, type: dbType }, { platform, projectType, nodeID, context }) => {
    const getNodeType = APP_BLOCK_TYPE_FROM_DB[dbType];

    const type = typeof getNodeType === 'function' ? getNodeType(dbData, { context }) : getNodeType || dbType;

    let data: Partial<NodeData<unknown>> = {};

    try {
      const adapters = getBlockAdapters(platform, projectType, needsMigration(dbType, type));

      data = adapters[type]?.fromDB(dbData, { context, ports: dbData.ports, portsV2: dbData.portsV2 }) || { deprecatedType: type, ...dbData };
    } catch {
      data = { deprecatedType: type, ...dbData };
    }

    return {
      name: '',
      ...data,
      type: data.deprecatedType ? BlockType.DEPRECATED : type,
      nodeID,
    };
  },
  ({ type, deprecatedType, nodeID, ...appData }, { platform, projectType, context }) => {
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[type];
    const dbType = typeof getNodeType === 'function' ? getNodeType(appData, { context }) : getNodeType || deprecatedType || type;

    let data: BaseModels.BaseDiagramNode['data'] = {};

    try {
      const adapters = getBlockAdapters(platform, projectType);

      data = adapters[type]?.toDB(appData as any, { context }) || (appData as any);
    } catch {
      data = appData as any;
    }

    return {
      data,
      type: dbType,
    };
  }
);

export default nodeDataAdapter;
