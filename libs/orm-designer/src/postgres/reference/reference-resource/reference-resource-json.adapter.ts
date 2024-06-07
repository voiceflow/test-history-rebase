import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { ReferenceResourceJSON, ReferenceResourceObject } from './reference-resource.interface';

export const ReferenceResourceJSONAdapter = createSmartMultiAdapter<ReferenceResourceObject, ReferenceResourceJSON>(
  (data) => data,
  (data) => data
);
