import { LoguxControlOptions } from '../control';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import VersionChannel from './version';
import WorkspaceChannel from './workspace';

export type ChannelMap = {
  diagram: DiagramChannel;
  project: ProjectChannel;
  version: VersionChannel;
  workspace: WorkspaceChannel;
};

const buildChannels = (options: LoguxControlOptions): ChannelMap => ({
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  version: new VersionChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;
