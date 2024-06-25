import type { Sentiment, SystemTag } from '@/models/Transcript';

export interface DBReportTag {
  tagID: string;
  label: string;
}
export interface ReportTag {
  id: string | Sentiment | SystemTag;
  label: string;
  icon?: string;
  projectID: string;
  iconColor?: string;
}
