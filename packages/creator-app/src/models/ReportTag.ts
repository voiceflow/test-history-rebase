import { Sentiment, SystemTag } from '@/models/Transcript';

export interface ReportTag {
  // the ID of this report tag
  id: string | Sentiment | SystemTag;
  // the project this transcript is related to
  projectID: string;
  // a human-readable label for this tag
  label: string;
  builtIn?: boolean;
  icon?: any;
  iconColor?: string;
}
