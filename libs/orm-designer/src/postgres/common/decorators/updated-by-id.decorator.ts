import { ManyToOne } from '@mikro-orm/core';

import { UserStubEntity } from '@/postgres/stubs/user.stub';

export const UpdatedByID = () => ManyToOne(() => UserStubEntity, { name: 'updated_by_id' });
