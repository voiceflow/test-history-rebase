import { Config } from '@/types';

import { ClientMap } from '../clients';
import Diagram from './diagram';
import Program from './program';
import Project from './project';
import PrototypeProgram from './prototype-program';
import VariableState from './variable-state';
import Version from './version';

export interface ModelMap {
  diagram: Diagram;
  version: Version;
  project: Project;
  variableState: VariableState;
  prototypeProgram: PrototypeProgram;
  program: Program;
}

/**
 * Build all models
 */
const buildModels = ({ config, clients }: { config: Config; clients: ClientMap }): ModelMap => {
  return {
    diagram: new Diagram(config, { clients }),
    version: new Version(config, { clients }),
    project: new Project(config, { clients }),
    variableState: new VariableState(config, { clients }),
    program: new Program(config, { clients }),
    prototypeProgram: new PrototypeProgram(config, { clients }),
  };
};

export default buildModels;
