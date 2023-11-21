import { MongoAtomicORM } from '../common';
import { ProgramEntity } from './program.entity';

export class ProgramORM extends MongoAtomicORM(ProgramEntity) {}
