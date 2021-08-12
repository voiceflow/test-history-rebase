import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Transcript } from '@/models';

const transcriptAdapter = createAdapter<any, Transcript>(
  ({ _id: id, annotations, ...data }) => ({ id, annotations: annotations || {}, ...data }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default transcriptAdapter;
