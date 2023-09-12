import { LoguxControlOptions } from '@/legacy/control';

import RemoveTranscriptControl from './remove';

const buildTranscriptActionControls = (options: LoguxControlOptions) => ({
  removeTranscriptControl: new RemoveTranscriptControl(options),
});

export default buildTranscriptActionControls;
