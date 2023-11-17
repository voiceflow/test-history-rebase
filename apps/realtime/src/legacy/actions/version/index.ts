import { LoguxControlOptions } from '../../control';
import AddManyComponentsControl from './addManyComponents';
import PatchVersionDefaultStepColors from './patchDefaultStepColors';
import PatchVersionPublishingControl from './patchPublishing';
import PatchVersionSessionControl from './patchSession';
import PatchVersionSettingsControl from './patchSettings';
import ReloadFoldersControl from './reloadFolders';
import ReorderComponentsControl from './reorderComponents';
import { MigrateSchemaDoneControl, MigrateSchemaFailedControl, MigrateSchemaStartedControl } from './schema';
import {
  AddGlobalVariableControl,
  AddManyGlobalVariablesControl,
  ReloadGlobalVariableControl,
  RemoveGlobalVariableControl,
  RemoveManyGlobalVariablesControl,
} from './variable';

const buildVersionActionControls = (options: LoguxControlOptions) => ({
  reloadFoldersControl: new ReloadFoldersControl(options),
  reorderComponentsControl: new ReorderComponentsControl(options),
  addManyComponentsControl: new AddManyComponentsControl(options),
  patchVersionSessionControl: new PatchVersionSessionControl(options),
  patchVersionSettingsControl: new PatchVersionSettingsControl(options),
  patchVersionPublishingControl: new PatchVersionPublishingControl(options),
  patchVersionDefaultStepColors: new PatchVersionDefaultStepColors(options),

  // variables
  addGlobalVariableControl: new AddGlobalVariableControl(options),
  reloadGlobalVariableControl: new ReloadGlobalVariableControl(options),
  removeGlobalVariableControl: new RemoveGlobalVariableControl(options),
  addManyGlobalVariablesControl: new AddManyGlobalVariablesControl(options),
  removeManyGlobalVariablesControl: new RemoveManyGlobalVariablesControl(options),

  // TODO: move broadcast only to nestjs
  // schema
  migrateSchemaDoneControl: new MigrateSchemaDoneControl(options),
  migrateSchemaFailedControl: new MigrateSchemaFailedControl(options),
  migrateSchemaStartedControl: new MigrateSchemaStartedControl(options),
});

export default buildVersionActionControls;
