import { LoguxControlOptions } from '@/control';

import buildCanvasTemplateActionControls from './canvasTemplates';
import buildCreatorActionControls from './creator';
import buildDiagramActionControls from './diagram';
import buildIntentActionControls from './intent';
import buildLinkActionControls from './link';
import buildNluActionControls from './nlu';
import buildNodeActionControls from './node';
import buildNoteActionControls from './note';
import buildOrganizationActionControls from './organization';
import buildPortActionControls from './port';
import buildProjectActionControls from './project';
import buildProjectListActionControls from './projectList';
import buildSlotActionControls from './slot';
import buildThreadActionControls from './thread';
import buildTranscriptActionControls from './transcript';
import buildVariableStateActionControls from './variableState';
import buildVersionActionControls from './version';
import buildWorkspaceActionControls from './workspace';

const buildActions = (options: LoguxControlOptions) => ({
  ...buildDiagramActionControls(options),
  ...buildCanvasTemplateActionControls(options),
  ...buildCreatorActionControls(options),
  ...buildIntentActionControls(options),
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildPortActionControls(options),
  ...buildProjectActionControls(options),
  ...buildProjectListActionControls(options),
  ...buildSlotActionControls(options),
  ...buildVersionActionControls(options),
  ...buildWorkspaceActionControls(options),
  ...buildOrganizationActionControls(options),
  ...buildVariableStateActionControls(options),
  ...buildNoteActionControls(options),
  ...buildThreadActionControls(options),
  ...buildTranscriptActionControls(options),
  ...buildNluActionControls(options),
});

export default buildActions;

export type ActionMap = ReturnType<typeof buildActions>;
