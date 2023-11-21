import { MongoAtomicORM } from '../common';
import { PrototypeProgramEntity } from './prototype-program.entity';

export class PrototypeProgramORM extends MongoAtomicORM(PrototypeProgramEntity) {}
