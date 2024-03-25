import { MongoAtomicORM } from '../common';
import { ProgramEntity } from './program.entity';
import { ProgramJSONAdapter } from './program-json.adapter';

export class ProgramORM extends MongoAtomicORM<ProgramEntity> {
  Entity = ProgramEntity;

  jsonAdapter = ProgramJSONAdapter;
}
