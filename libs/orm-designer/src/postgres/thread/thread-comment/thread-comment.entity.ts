import type { Ref } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../../stubs/user.stub';
import { ThreadEntity } from '../thread.entity';
import { ThreadCommentJSONAdapter } from './thread-comment.adapter';

@Entity({ schema: 'app_cxd', tableName: 'thread_comment' })
@SoftDelete()
export class ThreadCommentEntity extends PostgresCreatableEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ThreadCommentEntity>>>(data: JSON) {
    return ThreadCommentJSONAdapter.toDB<JSON>(data);
  }

  @OneToOne(() => UserStubEntity, { index: 'thread_comment_author_id_idx' })
  author: Ref<UserStubEntity>;

  @ManyToOne(() => ThreadEntity, { index: 'thread_comment_thread_id_idx' })
  thread: Ref<ThreadEntity>;

  @Property({ columnType: 'text' })
  text: string;

  @Property({ columnType: 'jsonb', default: '[]' })
  mentions: number[];

  /**
   * @deprecated removed in favor of hard delete
   */
  @Property({ default: null, type: 'timestamptz', nullable: true })
  deletedAt: Date | null = null;

  constructor(data: EntityCreateParams<ThreadCommentEntity>) {
    super();

    ({
      text: this.text,
      author: this.author,
      thread: this.thread,
      mentions: this.mentions,
    } = ThreadCommentEntity.fromJSON(data));
  }

  toJSON(): ToJSONWithForeignKeys<ThreadCommentEntity> {
    return ThreadCommentJSONAdapter.fromDB({
      ...this.wrap<ThreadCommentEntity>(),
      thread: this.thread,
      author: this.author,
    });
  }
}
