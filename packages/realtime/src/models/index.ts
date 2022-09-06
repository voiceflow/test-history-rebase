import { Config } from '@/types';

import { ClientMap } from '../clients';
import Diagram from './diagram';
import Project from './project';
import Version from './version';

export interface ModelMap {
  diagram: Diagram;
  version: Version;
  project: Project;
}

/**
 * Build all models
 */
const buildModels = ({ config, clients }: { config: Config; clients: ClientMap }): ModelMap => {
  return {
    diagram: new Diagram(config, { clients }),
    version: new Version(config, { clients }),
    project: new Project(config, { clients }),
  };
};

export default buildModels;
