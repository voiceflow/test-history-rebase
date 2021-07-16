import { LoguxControlOptions } from '../control';
import buildDiagramActionControls, { DiagramActionControlMap } from './diagram';
import buildLinkActionControls, { LinkActionControlMap } from './link';
import buildNodeActionControls, { NodeActionControlMap } from './node';
import buildProjectActionControls, { ProjectActionControlMap } from './project';

export type ActionMap = DiagramActionControlMap & LinkActionControlMap & NodeActionControlMap & ProjectActionControlMap;

const buildActions = (options: LoguxControlOptions): ActionMap => ({
  ...buildLinkActionControls(options),
  ...buildNodeActionControls(options),
  ...buildDiagramActionControls(options),
  ...buildProjectActionControls(options),
});

export default buildActions;
