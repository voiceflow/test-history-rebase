import { Config } from '@/types';

import { ClientMap } from '../clients';
import Diagram from './diagram';

export interface ModelMap {
  diagram: Diagram;
}

/**
 * Build all models
 */
const buildModels = ({ config, clients }: { config: Config; clients: ClientMap }): ModelMap => {
  const models = {} as ModelMap;

  models.diagram = new Diagram(config, { clients });

  return models;
};

export default buildModels;
