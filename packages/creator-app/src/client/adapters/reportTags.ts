import { createAdapter } from '@/client/adapters/utils';
import { DBReportTag, ReportTag } from '@/models';

const reportTagsAdapter = createAdapter<DBReportTag, ReportTag, [{ projectID: string }]>(
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
