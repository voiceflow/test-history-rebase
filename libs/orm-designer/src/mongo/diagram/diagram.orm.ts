import { MongoMutableORM } from '../common';
import { DiagramEntity } from './diagram.entity';

export class DiagramORM extends MongoMutableORM(DiagramEntity) {
  findManyByAssistant(assistantID: string) {
    return this.find({ assistantID });
  }
}
