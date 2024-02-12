import { LoguxControlOptions } from '@/legacy/control';

import RemoveTranscriptControl from './remove';
import UpdateUnreadTranscriptsControl from './updateUnread';

const buildTranscriptActionControls = (options: LoguxControlOptions) => ({
  removeTranscriptControl: new RemoveTranscriptControl(options),
  updateUnreadTranscriptsControl: new UpdateUnreadTranscriptsControl(options),
});

export default buildTranscriptActionControls;
