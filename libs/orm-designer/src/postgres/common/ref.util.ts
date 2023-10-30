import type { EntityClass, Primary, PrimaryProperty } from '@mikro-orm/core';
import { ref as mikroRef } from '@mikro-orm/core';

import type { Ref } from '@/types';

export const ref = <
  T extends object,
  PK extends keyof T | unknown = PrimaryProperty<T>,
  PKV extends Primary<T> = Primary<T>
>(
  entityType: EntityClass<T>,
  pk?: T | PKV
): Ref<T, PK> => mikroRef(entityType, pk) as Ref<T, PK>;
