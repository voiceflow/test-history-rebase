import { Collection, Entity, Index, OneToMany, Property, Unique, wrap } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import type { ThreadCommentEntity } from './thread-comment/thread-comment.entity';
import { ThreadEntityAdapter } from './thread-entity.adapter';

@Entity({ schema: 'app_cxd', tableName: 'thread' })
@Unique({ properties: ['id'] })
@SoftDelete()
export class ThreadEntity extends PostgresCreatableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ThreadEntity>>>(data: JSON) {
    return ThreadEntityAdapter.toDB<JSON>(data);
  }

  @Property({ name: 'node_id', nullable: true, type: 'text' })
  nodeID: string | null = null;

  @Index({ name: 'thread_diagram_id_idx' })
  @Property({ name: 'diagram_id', type: 'text' })
  diagramID: string;

  @Index({ name: 'thread_assistant_id_idx' })
  @Property({ name: 'assistant_id', type: 'text' })
  assistantID: string;

  @Property({ default: false })
  resolved: boolean;

  @Property({ type: 'jsonb' })
  position: [number, number];

  @OneToMany('ThreadCommentEntity', (value: ThreadCommentEntity) => value.thread)
  comments = new Collection<ThreadCommentEntity>(this);

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

  toJSON(...args: any[]): ToJSONWithForeignKeys<ThreadEntity> {
    return ThreadEntityAdapter.fromDB(wrap<ThreadEntity>(this).toObject(...args));
  }
}
