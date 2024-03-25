import { Entity, Index, Property, Unique } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';

@Entity({ schema: 'app_cxd', tableName: 'thread' })
@Unique({ properties: ['id'] })
@SoftDelete()
export class ThreadEntity extends PostgresCreatableEntity<'nodeID' | 'resolved' | 'deletedAt'> {
  @Property({ name: 'node_id', nullable: true, type: 'text' })
  nodeID!: string | null;

  @Index({ name: 'thread_diagram_id_idx' })
  @Property({ name: 'diagram_id', type: 'text' })
  diagramID!: string;

  @Index({ name: 'thread_assistant_id_idx' })
  @Property({ name: 'assistant_id', type: 'text' })
  assistantID!: string;

  @Property({ default: false })
  resolved!: boolean;

  @Property({ type: 'jsonb' })
  position!: [number, number];

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
