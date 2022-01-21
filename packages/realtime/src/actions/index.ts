import { LoguxControlOptions } from '@/control';

import buildDiagramActionControls from './diagram';
import buildIntentActionControls from './intent';
import buildLinkActionControls from './link';
import buildNodeActionControls from './node';
import buildProductActionControls from './product';
import buildProjectActionControls from './project';
import buildProjectListActionControls from './projectList';
import buildSlotActionControls from './slot';
import buildVariableStateActionControls from './variableState';
import buildVersionActionControls from './version';
import buildWorkspaceActionControls from './workspace';

const buildActions = (options: LoguxControlOptions) => ({
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
  ...buildVariableStateActionControls(options),
});

export default buildActions;

export type ActionMap = ReturnType<typeof buildActions>;
