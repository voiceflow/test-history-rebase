import { Entity, Index, Property } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

@Entity({ schema: 'app_cxd', tableName: 'thread' })
@SoftDelete()
export class ThreadEntity extends PostgresCreatableEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ThreadEntity>>({ ...data }: Data) {
    return {
      ...data,
    } as ResolvedForeignKeys<ThreadEntity, Data>;
  }

  @Property({ name: 'node_id', nullable: true, columnType: 'text' })
  nodeID: string;

  @Index({ name: 'thread_diagram_id_idx' })
  @Property({ name: 'diagram_id', nullable: true, columnType: 'text' })
  diagramID: string;

  @Index({ name: 'thread_assistant_id_idx' })
  @Property({ name: 'assistant_id', columnType: 'text' })
  assistantID: string;

  @Property({ default: false })
  resolved: boolean;

  @Property({ columnType: 'jsonb' })
  position: [number, number];

  constructor(data: EntityCreateParams<ThreadEntity>) {
    super();

    ({
      nodeID: this.nodeID,
      resolved: this.resolved,
      position: this.position,
      diagramID: this.diagramID,
      assistantID: this.assistantID,
    } = ThreadEntity.resolveForeignKeys(data));
  }
}
