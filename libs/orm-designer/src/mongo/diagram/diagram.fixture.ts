import type { EntityDTO } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

import type { DiagramEntity } from './diagram.entity';
import { DiagramVersion } from './diagram-version.enum';
import { startNode } from './node/start/start.node.fixture';

export const diagram: EntityDTO<DiagramEntity> = {
  _id: new ObjectId(),
  id: 'diagram-1',
  _version: DiagramVersion.V3_0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
  assistantID: 'assistant-1',
  nodes: {
    [startNode.id]: startNode,
  },
};
