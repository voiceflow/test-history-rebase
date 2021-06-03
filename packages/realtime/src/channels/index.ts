import { Plugin } from '@/types';

import diagramChannel from './diagram';
import projectChannel from './project';
import versionChannel from './version';

const channels: Plugin = (server) => server.use(diagramChannel, versionChannel, projectChannel);

export default channels;
