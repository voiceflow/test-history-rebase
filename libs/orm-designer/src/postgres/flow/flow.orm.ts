import { PostgresCMSTabularORM } from '../common';
import { FlowEntity } from './flow.entity';

export class FlowORM extends PostgresCMSTabularORM(FlowEntity) {
  findManyByDiagramIDs(environmentID: string, diagramIDs: string[]) {
    return this.find({ environmentID, diagramID: diagramIDs });
  }
}
