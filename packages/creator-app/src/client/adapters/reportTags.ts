import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { ReportTag } from '@/models';

const reportTagsAdapter = createAdapter<ReportTag, ReportTag>(
  (data) => data,
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default reportTagsAdapter;
