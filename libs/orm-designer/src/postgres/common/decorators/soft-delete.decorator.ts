import { Filter } from '@mikro-orm/core';

/**
 * @deprecated should be dropped when deletedAt dropped from the database
 */
export const SoftDelete = () => Filter({ name: 'soft_delete', cond: { deletedAt: { $eq: null } }, default: true });
