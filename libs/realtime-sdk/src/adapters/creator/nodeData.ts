import type { BaseModels } from '@voiceflow/base-types';
import type * as Platform from '@voiceflow/platform-config/backend';
import { createSimpleAdapter } from 'bidirectional-adapter';

import { BlockType } from '@/constants';
import type { NodeData } from '@/models';

import type { AdapterContext } from '../types';
import { APP_BLOCK_TYPE_FROM_DB, DB_BLOCK_TYPE_FROM_APP, getBlockAdapters } from './block';
import { needsMigration } from './utils';

const nodeDataAdapter = createSimpleAdapter<
  { data: BaseModels.BaseDiagramNode['data']; type: string },
  NodeData<unknown>,
  [
    {
      platform: Platform.Constants.PlatformType;
      projectType: Platform.Constants.ProjectType;
      nodeID: string;
      context: AdapterContext;
    },
  ],
  [{ platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType; context: AdapterContext }]
>(
  ({ data: dbData, type: dbType }, { platform, projectType, nodeID, context }) => {
    const getNodeType = APP_BLOCK_TYPE_FROM_DB[dbType];

    const type = typeof getNodeType === 'function' ? getNodeType(dbData, { context }) : getNodeType || dbType;

    let data: Partial<NodeData<unknown & { portsV2?: unknown }>> = {};

    try {
      const adapters = getBlockAdapters(platform, projectType, needsMigration(dbType, type));

      data = adapters[type]?.fromDB(dbData, { context, ports: dbData.ports, portsV2: dbData.portsV2 }) || {
        deprecatedType: type,
        ...dbData,
      };
    } catch {
      data = { deprecatedType: type, ...dbData };
    }

    // strip portsV2 from adapted data, ports catalogued separately in nodeAdapter
    const { portsV2: _, ...sanitizedData } = data;

    return {
      name: data.name ?? dbData.name ?? '',
      ...sanitizedData,
      type: data.deprecatedType ? BlockType.DEPRECATED : type,
      nodeID,
    };
  },
  ({ type, deprecatedType, nodeID, ...appData }, { platform, projectType, context }) => {
    const getNodeType = DB_BLOCK_TYPE_FROM_APP[type];
    const dbType =
      typeof getNodeType === 'function' ? getNodeType(appData, { context }) : getNodeType || deprecatedType || type;

    let data: BaseModels.BaseDiagramNode['data'] = {};

    try {
      const adapters = getBlockAdapters(platform, projectType);

      data = adapters[type]?.toDB(appData as any, { context }) || (appData as any);
    } catch {
      data = appData as any;
    }

    return {
      data: { name: appData.name, ...data },
      type: dbType,
    };
  }
);

export default nodeDataAdapter;
