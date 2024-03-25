import type { Ref } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';

import { UserStubEntity } from '../../stubs/user.stub';
import { ThreadEntity } from '../thread.entity';

@Entity({ schema: 'app_cxd', tableName: 'thread_comment' })
@SoftDelete()
export class ThreadCommentEntity extends PostgresCreatableEntity<'mentions' | 'deletedAt'> {
  @OneToOne(() => UserStubEntity, { name: 'author_id' })
  author!: Ref<UserStubEntity>;

  @ManyToOne(() => ThreadEntity, { name: 'thread_id' })
  thread!: Ref<ThreadEntity>;

  @Property({ type: 'text' })
  text!: string;

  @Property({ type: 'jsonb', default: '[]' })
  mentions!: number[];

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
