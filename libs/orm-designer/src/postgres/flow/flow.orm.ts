import { PostgresCMSTabularORM } from '../common';
import { FlowEntity } from './flow.entity';

export class FlowORM extends PostgresCMSTabularORM(FlowEntity) {}
