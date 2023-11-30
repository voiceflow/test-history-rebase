import { atom } from 'jotai';

import { entityClassifiersMapAtom } from '@/atoms/entity.atom';

import type { CMSEntitySortContext } from './CMSEntity.interface';

export const cmsEntitySortContextAtom = atom(
  (get): CMSEntitySortContext => ({
    entityClassifiersMap: get(entityClassifiersMapAtom),
  })
);
