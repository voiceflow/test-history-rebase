import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBReportTag, ReportTag } from '@/models';

const reportTagsAdapter = createMultiAdapter<DBReportTag, ReportTag, [{ projectID: string }]>(
  ({ tagID, label }, { projectID }) => ({
    id: tagID,
    label,
    projectID,
  }),
  ({ id, label }) => ({
    tagID: id,
    label,
  })
);

export default reportTagsAdapter;
