import { ManyToOne } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';

export const CreatedByID = () => ManyToOne(() => UserStubEntity, { name: 'created_by_id' });
