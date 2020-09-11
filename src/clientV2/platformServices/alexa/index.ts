import exportService from './export';
import projectService from './project';
import prototypeService from './prototype';
import publishService from './publish';
import sessionService from './session';
import versionService from './version';

const alexaServiceClient = {
  ...exportService,
  ...projectService,
  ...prototypeService,
  ...publishService,
  ...sessionService,
  ...versionService,
};

export default alexaServiceClient;
