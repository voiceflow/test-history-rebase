import { Config } from '@/types';

import NlpController from './nlp';
import { ControllerDependencies } from './utils';

export interface ControllersMap {
  nlp: NlpController;
}

const buildControllers = (config: Config, dependencies: ControllerDependencies) => {
  const controllers = {} as ControllersMap;

  controllers.nlp = new NlpController(config, dependencies);

  return controllers;
};

export default buildControllers;
