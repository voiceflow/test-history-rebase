import { LoguxControlOptions } from '../control';
import CreatorChannel from './creator';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import WorkspaceChannel from './workspace';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const buildChannels = (options: LoguxControlOptions) => ({
  creator: new CreatorChannel(options),
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;

export type ChannelMap = ReturnType<typeof buildChannels>;
