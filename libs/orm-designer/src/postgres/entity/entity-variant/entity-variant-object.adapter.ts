import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityVariantObject } from './entity-variant.interface';

export const EntityVariantObjectAdapter = createSmartMultiAdapter<EntityVariantObject, EntityVariantObject>(
  ({ synonyms, ...data }) => ({
    ...data,

    ...(synonyms !== undefined && {
      synonyms: synonyms.map((synonym) =>
        synonym.toLocaleLowerCase() === '"null"' ? synonym.replaceAll('"', '') : synonym
      ),
    }),
  }),
  ({ synonyms, ...data }) => ({
    ...data,

    ...(synonyms !== undefined && {
      synonyms: synonyms.map((synonym) => (synonym.toLocaleLowerCase() === 'null' ? `"${synonym}"` : synonym)),
    }),
  })
);
