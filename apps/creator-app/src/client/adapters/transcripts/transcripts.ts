import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import { Transcript } from '@/models';

const transcriptAdapter = createMultiAdapter<any, Transcript>(
  ({ _id: id, annotations, ...data }) => ({ id, annotations: annotations || {}, ...data }),
  notImplementedAdapter.transformer
);

export default transcriptAdapter;
