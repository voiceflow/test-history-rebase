import type { Ref } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToOne, Property, ref, wrap } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../../stubs/user.stub';
import { ThreadEntity } from '../thread.entity';
import { ThreadCommentEntityAdapter } from './thread-comment-entity.adapter';

@Entity({ schema: 'app_cxd', tableName: 'thread_comment' })
@SoftDelete()
export class ThreadCommentEntity extends PostgresCreatableEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ThreadCommentEntity>>({
    authorID,
    threadID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(authorID !== undefined && { author: ref(UserStubEntity, authorID) }),
      ...(threadID !== undefined && { author: ref(ThreadEntity, threadID) }),
    } as ResolvedForeignKeys<ThreadCommentEntity, Data>;
  }

  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ThreadCommentEntity>>>(data: JSON) {
    return ThreadCommentEntityAdapter.toDB<JSON>(data);
  }

  @OneToOne(() => UserStubEntity, { name: 'author_id' })
  author: Ref<UserStubEntity>;

  @ManyToOne(() => ThreadEntity, { name: 'thread_id' })
  thread: Ref<ThreadEntity>;

  @Property({ type: 'text' })
  text: string;

  @Property({ type: 'jsonb', default: '[]' })
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

  toJSON(...args: any[]): ToJSONWithForeignKeys<ThreadCommentEntity> {
    return ThreadCommentEntityAdapter.fromDB({
      ...wrap<ThreadCommentEntity>(this).toObject(...args),
      text: this.text,
      author: this.author,
      thread: this.thread,
      mentions: this.mentions,
    });
  }
}
