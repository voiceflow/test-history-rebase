import { Entity, Property } from '@mikro-orm/core';

import { MongoObjectEntity } from '../common';
import { getLatestVersion } from '../common/mongo.utils';
import type { AnyNode } from './diagram.types';
import { DiagramVersion } from './diagram-version.enum';

@Entity({ collection: 'diagram' })
export class DiagramEntity extends MongoObjectEntity {
  @Property()
  nodes: Record<string, AnyNode>;

  @Property()
  assistantID: string;

  constructor({ nodes, assistantID }: Pick<DiagramEntity, 'nodes' | 'assistantID'>) {
    super({ _version: getLatestVersion(DiagramVersion) });

    this.nodes = nodes;
    this.assistantID = assistantID;
  }
}
