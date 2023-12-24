import { LoguxControlOptions } from '@/legacy/control';

import buildCanvasTemplateActionControls from './canvasTemplates';
import buildCreatorActionControls from './creator';
import buildCustomBlockActionControls from './customBlock';
import buildDiagramActionControls from './diagram';
import buildDomainActionControls from './domain';
import buildIntentActionControls from './intent';
import buildLinkActionControls from './link';
import buildNodeActionControls from './node';
import buildNoteActionControls from './note';
import buildOrganizationActionControls from './organization';
import buildPortActionControls from './port';
import buildProjectActionControls from './project';
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
  ...buildCustomBlockActionControls(options),
  ...buildIntentActionControls(options),
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildPortActionControls(options),
  ...buildProjectActionControls(options),
  ...buildSlotActionControls(options),
  ...buildVersionActionControls(options),
  ...buildWorkspaceActionControls(options),
  ...buildOrganizationActionControls(options),
  ...buildVariableStateActionControls(options),
  ...buildNoteActionControls(options),
  ...buildThreadActionControls(options),
  ...buildTranscriptActionControls(options),
  ...buildDomainActionControls(options),
});

export default buildActions;

export type ActionMap = ReturnType<typeof buildActions>;
