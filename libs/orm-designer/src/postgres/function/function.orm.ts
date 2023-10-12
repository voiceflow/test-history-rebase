import { PostgresCMSTabularORM } from '../common';
import { FunctionEntity } from './function.entity';

export class FunctionORM extends PostgresCMSTabularORM(FunctionEntity) {}
