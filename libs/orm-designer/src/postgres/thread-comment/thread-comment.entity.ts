import type { Ref } from '@mikro-orm/core';
import { Entity, ManyToOne, OneToOne, Property, ref } from '@mikro-orm/core';

import { PostgresCreatableEntity, SoftDelete } from '@/postgres/common';
import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import { ThreadEntity } from '../thread/thread.entity';

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

  @OneToOne({ entity: () => UserStubEntity, index: 'thread_comment_author_id_idx' })
  author: Ref<UserStubEntity>;

  @ManyToOne({ entity: () => ThreadEntity, index: 'thread_comment_thread_id_idx' })
  thread: Ref<ThreadEntity>;

  @Property({ columnType: 'text' })
  text: string;

  @Property({ columnType: 'jsonb', default: '[]' })
  mentions: number[];

  constructor(data: EntityCreateParams<ThreadCommentEntity>) {
    super();

    ({
      text: this.text,
      author: this.author,
      thread: this.thread,
      mentions: this.mentions,
    } = ThreadCommentEntity.resolveForeignKeys(data));
  }
}
