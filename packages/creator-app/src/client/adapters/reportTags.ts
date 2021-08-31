import { Adapters } from '@voiceflow/realtime-sdk';

import { DBReportTag, ReportTag } from '@/models';

const reportTagsAdapter = Adapters.createAdapter<DBReportTag, ReportTag, [{ projectID: string }]>(
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
