import { LoguxControlOptions } from '../control';
import CreatorChannel from './creator';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import VersionChannel from './version';
import WorkspaceChannel from './workspace';

export interface ChannelMap {
  creator: CreatorChannel;
  diagram: DiagramChannel;
  project: ProjectChannel;
  version: VersionChannel;
  workspace: WorkspaceChannel;
}

const buildChannels = (options: LoguxControlOptions): ChannelMap => ({
  creator: new CreatorChannel(options),
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  version: new VersionChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;
