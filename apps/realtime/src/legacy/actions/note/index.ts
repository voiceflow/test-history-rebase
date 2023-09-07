import { LoguxControlOptions } from '@/control';

import AddManyNotesControl from './addMany';
import RemoveNoteControl from './remove';
import RemoveManyNotesControl from './removeMany';
import UpsertNoteControl from './upsert';

const buildNoteActionControls = (options: LoguxControlOptions) => ({
  upsertNoteControl: new UpsertNoteControl(options),
  removeNoteControl: new RemoveNoteControl(options),
  addManyNotesControl: new AddManyNotesControl(options),
  removeManyNotesControl: new RemoveManyNotesControl(options),
});

export default buildNoteActionControls;
