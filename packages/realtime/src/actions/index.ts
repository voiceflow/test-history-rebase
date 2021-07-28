import { LoguxControlOptions } from '../control';
import buildDiagramActionControls, { DiagramActionControlMap } from './diagram';
import buildLinkActionControls, { LinkActionControlMap } from './link';
import buildNodeActionControls, { NodeActionControlMap } from './node';
import buildProjectActionControls, { ProjectActionControlMap } from './project';
import buildWorkspaceActionControls, { WorkspaceActionControlMap } from './workspace';

export type ActionMap = DiagramActionControlMap & LinkActionControlMap & NodeActionControlMap & ProjectActionControlMap & WorkspaceActionControlMap;

const buildActions = (options: LoguxControlOptions): ActionMap => ({
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildDiagramActionControls(options),
  ...buildProjectActionControls(options),
  ...buildWorkspaceActionControls(options),
});

export default buildActions;
