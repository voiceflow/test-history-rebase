import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Transcript } from '@/models';

const transcriptAdapter = createAdapter<Transcript, Transcript>(
  (data) => data,
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default transcriptAdapter;
