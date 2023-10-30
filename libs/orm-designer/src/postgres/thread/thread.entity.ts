import { Entity, Index, Property } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { ThreadJSONAdapter } from './thread.adapter';

@Entity({ schema: 'app_cxd', tableName: 'thread' })
@SoftDelete()
export class ThreadEntity extends PostgresCreatableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ThreadEntity>>>(data: JSON) {
    return ThreadJSONAdapter.toDB<JSON>(data);
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

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  constructor(data: EntityCreateParams<ThreadEntity>) {
    super();

    ({
      nodeID: this.nodeID,
      resolved: this.resolved,
      position: this.position,
      diagramID: this.diagramID,
      assistantID: this.assistantID,
    } = ThreadEntity.fromJSON(data));
  }

  toJSON(): ToJSONWithForeignKeys<ThreadEntity> {
    return ThreadJSONAdapter.fromDB(this.wrap<ThreadEntity>());
  }
}
