import { LoguxControlOptions } from '../control';
import CreatorChannel from './creator';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import WorkspaceChannel from './workspace';

const buildChannels = (options: LoguxControlOptions) => ({
  creator: new CreatorChannel(options),
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;

export type ChannelMap = ReturnType<typeof buildChannels>;
