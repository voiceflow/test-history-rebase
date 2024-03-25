import type { ToJSON, ToObject } from '@/types';

import type { FlowEntity } from './flow.entity';

export type FlowObject = ToObject<FlowEntity>;
export type FlowJSON = ToJSON<FlowObject>;
