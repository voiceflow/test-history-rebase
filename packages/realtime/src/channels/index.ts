import { Plugin } from '@/types';

import diagramChannel from './diagram';
import projectChannel from './project';
import versionChannel from './version';
import workspaceChannel from './workspace';

const channels: Plugin = (server) => server.use(diagramChannel, versionChannel, projectChannel, workspaceChannel);

export default channels;
