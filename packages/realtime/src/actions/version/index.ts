import { LoguxControlOptions } from '../../control';
import PatchVersionDefaultStepColors from './patchDefaultStepColors';
import PatchVersionPublishingControl from './patchPublishing';
import PatchVersionSessionControl from './patchSession';
import PatchVersionSettingsControl from './patchSettings';
import ReorderComponentsControl from './reorderComponents';
import ReorderTopicsControl from './reorderTopics';
import { MigrateSchemaDoneControl, MigrateSchemaFailedControl, MigrateSchemaStartedControl, NegotiateSchemaControl } from './schema';
import { AddGlobalVariableControl, AddManyGlobalVariablesControl, RemoveGlobalVariableControl, RemoveManyGlobalVariablesControl } from './variable';

const buildVersionActionControls = (options: LoguxControlOptions) => ({
  reorderTopicsControl: new ReorderTopicsControl(options),
  reorderComponentsControl: new ReorderComponentsControl(options),
  patchVersionSessionControl: new PatchVersionSessionControl(options),
  patchVersionSettingsControl: new PatchVersionSettingsControl(options),
  patchVersionPublishingControl: new PatchVersionPublishingControl(options),
  patchVersionDefaultStepColors: new PatchVersionDefaultStepColors(options),

  // variables
  addGlobalVariableControl: new AddGlobalVariableControl(options),
  addManyGlobalVariablesControl: new AddManyGlobalVariablesControl(options),
  removeGlobalVariableControl: new RemoveGlobalVariableControl(options),
  removeManyGlobalVariablesControl: new RemoveManyGlobalVariablesControl(options),

  // schema
  negotiateSchemaControl: new NegotiateSchemaControl(options),
  migrateSchemaDoneControl: new MigrateSchemaDoneControl(options),
  migrateSchemaFailedControl: new MigrateSchemaFailedControl(options),
  migrateSchemaStartedControl: new MigrateSchemaStartedControl(options),
});

export default buildVersionActionControls;
