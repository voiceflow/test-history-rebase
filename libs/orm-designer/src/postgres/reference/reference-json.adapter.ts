import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { ReferenceJSON, ReferenceObject } from './reference.interface';

export const ReferenceJSONAdapter = createSmartMultiAdapter<ReferenceObject, ReferenceJSON>(
  (data) => data,
  (data) => data
);
