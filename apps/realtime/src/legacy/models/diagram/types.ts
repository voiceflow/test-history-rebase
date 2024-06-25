import type { BaseModels } from '@voiceflow/base-types';
import type { ObjectId } from 'bson';

import type { Atomic } from '../utils';

export interface ManyNodeDataUpdate extends Atomic.Update {
  nodeID: string;
}

export interface DBDiagramModel extends Omit<BaseModels.Diagram.Model, '_id' | 'versionID'> {
  _id: ObjectId;
  versionID: ObjectId;
}

export interface FromDB {
  (diagram: DBDiagramModel): BaseModels.Diagram.Model;

  <DBDiagram extends Partial<DBDiagramModel>>(
    diagram: DBDiagram
  ): Pick<BaseModels.Diagram.Model, Extract<keyof BaseModels.Diagram.Model, keyof DBDiagram>>;
}

export interface ToDB {
  (diagram: BaseModels.Diagram.Model): DBDiagramModel;

  <Diagram extends Partial<BaseModels.Diagram.Model>>(
    diagram: Diagram
  ): Pick<DBDiagramModel, Extract<keyof DBDiagramModel, keyof Diagram>>;
}

export interface MapFromDB {
  (diagrams: DBDiagramModel[]): BaseModels.Diagram.Model[];

  <DBDiagram extends Partial<DBDiagramModel>>(
    diagrams: DBDiagram[]
  ): Pick<BaseModels.Diagram.Model, Extract<keyof BaseModels.Diagram.Model, keyof DBDiagram>>[];
}

export interface MapToDB {
  (diagrams: BaseModels.Diagram.Model[]): DBDiagramModel[];

  <Diagram extends Partial<BaseModels.Diagram.Model>>(
    diagram: Diagram[]
  ): Pick<DBDiagramModel, Extract<keyof DBDiagramModel, keyof Diagram>>[];
}
