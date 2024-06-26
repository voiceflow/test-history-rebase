import type { LoguxControlOptions } from '@/legacy/control';

import buildCanvasTemplateActionControls from './canvasTemplates';
import buildCreatorActionControls from './creator';
import buildCustomBlockActionControls from './customBlock';
import buildDiagramActionControls from './diagram';
import buildFeatureActionControls from './feature';
import buildLinkActionControls from './link';
import buildNodeActionControls from './node';
import buildPortActionControls from './port';
import buildProjectActionControls from './project';
import buildTranscriptActionControls from './transcript';
import buildVariableStateActionControls from './variableState';
import buildVersionActionControls from './version';
import buildWorkspaceActionControls from './workspace';

const buildActions = (options: LoguxControlOptions) => ({
  ...buildDiagramActionControls(options),
  ...buildCanvasTemplateActionControls(options),
  ...buildCreatorActionControls(options),
  ...buildCustomBlockActionControls(options),
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildPortActionControls(options),
  ...buildProjectActionControls(options),
  ...buildVersionActionControls(options),
  ...buildWorkspaceActionControls(options),
  ...buildVariableStateActionControls(options),
  ...buildTranscriptActionControls(options),
  ...buildFeatureActionControls(options),
});

export default buildActions;

export type ActionMap = ReturnType<typeof buildActions>;
