import type { Ref } from '@mikro-orm/core';
import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';
import { IntegrationTokenScope, IntegrationTokenState } from '@voiceflow/dtos';

import { CreatedAt, PostgresEntity } from '@/postgres/common';
import { UserStubEntity } from '@/postgres/stubs/user.stub';

@Entity({ schema: 'auth', tableName: 'integration_oauth_tokens' })
export class IntegrationOauthTokenEntity extends PostgresEntity<'refreshToken' | 'meta' | 'creator'> {
  @Property({ type: 'text' })
  type!: string;

  @Enum(() => IntegrationTokenScope)
  scope!: IntegrationTokenScope;

  @Enum(() => IntegrationTokenState)
  state!: string;

  @Property({ type: 'jsonb', nullable: true, default: null })
  meta!: Record<string, unknown> | null;

  @OneToOne(() => UserStubEntity, { name: 'creator_id', deleteRule: 'set null', default: null, nullable: true })
  creator!: Ref<UserStubEntity> | null;

  @CreatedAt({ type: 'timestamptz' })
  createdAt!: Date;

  @Property({ type: 'text', nullable: true, default: null })
  subdomain!: string | null;

  @Property({ type: 'text' })
  resourceID!: string;

  @Property({ type: 'text' })
  accessToken!: string;

  @Property({ type: 'text', default: null, nullable: true })
  refreshToken!: string | null;
}
