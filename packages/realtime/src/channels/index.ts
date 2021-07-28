import { LoguxControlOptions } from '../control';
import DiagramChannel from './diagram';
import ProjectChannel from './project';
import WorkspaceChannel from './workspace';

export interface ChannelMap {
  diagram: DiagramChannel;
  project: ProjectChannel;
  workspace: WorkspaceChannel;
}

const buildChannels = (options: LoguxControlOptions): ChannelMap => ({
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  workspace: new WorkspaceChannel(options),
});

export default buildChannels;
