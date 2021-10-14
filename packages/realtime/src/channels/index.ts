import { LoguxControlOptions } from '../control';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import UserChannel from './user';
import VersionChannel from './version';
import WorkspaceChannel from './workspace';

export interface ChannelMap {
  user: UserChannel;
  diagram: DiagramChannel;
  project: ProjectChannel;
  version: VersionChannel;
  workspace: WorkspaceChannel;
}

const buildChannels = (options: LoguxControlOptions): ChannelMap => ({
  user: new UserChannel(options),
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  version: new VersionChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;
