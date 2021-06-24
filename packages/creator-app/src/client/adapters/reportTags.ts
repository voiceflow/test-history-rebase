import { createAdapter } from '@/client/adapters/utils';
import { ReportTag } from '@/models';

const reportTagsAdapter = createAdapter<ReportTag, ReportTag>(
  (data) => data,
  (data) => data
);

export default reportTagsAdapter;
