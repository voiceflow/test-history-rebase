import { Adapters } from '@voiceflow/realtime-sdk';

import { Transcript } from '@/models';

const transcriptAdapter = Adapters.createAdapter<any, Transcript>(
  ({ _id: id, annotations, ...data }) => ({ id, annotations: annotations || {}, ...data }),
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);

export default transcriptAdapter;
