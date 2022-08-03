import { Nullish, Struct } from '@voiceflow/common';
import { UpdateQuery } from 'mongodb';

export interface SetOperation {
  path: string | Array<string | Struct>;
  value: unknown;
}

export interface PullOperation {
  path: string;
  match: unknown;
}

export interface PushOperation {
  path: string;
  value: unknown | Array<unknown>;
  index?: Nullish<number>;
}

export interface UnsetOperation {
  path: string | Array<string | Struct>;
}

export interface ReorderOperation {
  path: string;
  match: Record<string, string | number>;
  index: number;
}

export interface Update {
  sets?: SetOperation[];
  pulls?: PullOperation[];
  pushes?: PushOperation[];
  unsets?: UnsetOperation[];
}

export type UpdateOperationType = keyof UpdateQuery<any>;

export interface UpdateOperation<K extends UpdateOperationType> {
  query: UpdateQuery<any>[K];
  operation: K;
  arrayFilters: Struct[];
}
