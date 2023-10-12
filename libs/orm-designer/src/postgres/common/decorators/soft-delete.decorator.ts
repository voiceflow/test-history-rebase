import { Filter } from '@mikro-orm/core';

export const SoftDelete = () => Filter({ name: 'soft_delete', cond: { deletedAt: { $eq: null } }, default: true });
