import { BaseModels } from '@voiceflow/base-types';

import AbstractModel from '../_mongo';

class DiagramModel extends AbstractModel<BaseModels.Diagram.Model<BaseModels.BaseDiagramNode>> {
  public collectionName = 'diagrams';
}

export default DiagramModel;
