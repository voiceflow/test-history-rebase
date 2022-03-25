import { LoguxControlOptions } from '@/control';

import RemoveNoteControl from './remove';
import UpsertNoteControl from './upsert';

const buildNoteActionControls = (options: LoguxControlOptions) => ({
  upsertNoteControl: new UpsertNoteControl(options),
  removeNoteControl: new RemoveNoteControl(options),
});

export default buildNoteActionControls;
