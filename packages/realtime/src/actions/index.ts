import { LoguxControlOptions } from '@/control';

import buildDiagramActionControls, { DiagramActionControlMap } from './diagram';
import buildIntentActionControls, { IntentActionControlMap } from './intent';
import buildLinkActionControls, { LinkActionControlMap } from './link';
import buildNodeActionControls, { NodeActionControlMap } from './node';
import buildProductActionControls, { ProductActionControlMap } from './product';
import buildProjectActionControls, { ProjectActionControlMap } from './project';
import buildProjectListActionControls, { ProjectListActionControlMap } from './projectList';
import buildSlotActionControls, { SlotActionControlMap } from './slot';
import buildVersionActionControls, { VersionActionControlMap } from './version';
import buildWorkspaceActionControls, { WorkspaceActionControlMap } from './workspace';

export type ActionMap = DiagramActionControlMap &
  IntentActionControlMap &
  LinkActionControlMap &
  NodeActionControlMap &
  ProductActionControlMap &
  ProjectActionControlMap &
  ProjectListActionControlMap &
  SlotActionControlMap &
  VersionActionControlMap &
  WorkspaceActionControlMap;

const buildActions = (options: LoguxControlOptions): ActionMap => ({
  ...buildDiagramActionControls(options),
  ...buildIntentActionControls(options),
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildProductActionControls(options),
  ...buildProjectActionControls(options),
  ...buildProjectListActionControls(options),
  ...buildSlotActionControls(options),
  ...buildVersionActionControls(options),
  ...buildWorkspaceActionControls(options),
});

export default buildActions;
