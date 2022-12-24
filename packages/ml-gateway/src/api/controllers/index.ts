import { Config } from '@/types';

import GenerationController from './generation';
import NlpController from './nlp';
import { ControllerDependencies } from './utils';

export interface ControllersMap {
  nlp: NlpController;
  generation: GenerationController;
}

const buildControllers = (config: Config, dependencies: ControllerDependencies) => {
  const controllers = {} as ControllersMap;

  controllers.nlp = new NlpController(config, dependencies);
  controllers.generation = new GenerationController(config, dependencies);

  return controllers;
};

export default buildControllers;
