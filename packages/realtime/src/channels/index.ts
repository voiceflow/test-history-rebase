import { LoguxControlOptions } from '../control';
import CreatorChannel from './creator';
import DiagramChannel from './diagram';
import LegacyDiagramChannel from './legacy_diagram';
import ProjectChannel from './project';
import SchemaChannel from './schema';
import VersionChannel from './version';
import WorkspaceChannel from './workspace';

const buildChannels = (options: LoguxControlOptions) => ({
  creator: new CreatorChannel(options),
  diagram: new DiagramChannel(options),
  project: new ProjectChannel(options),
  version: new VersionChannel(options),
  workspace: new WorkspaceChannel(options),
  schema: new SchemaChannel(options),
  legacyDiagramChannel: new LegacyDiagramChannel(options),
});

export default buildChannels;

export type ChannelMap = ReturnType<typeof buildChannels>;
