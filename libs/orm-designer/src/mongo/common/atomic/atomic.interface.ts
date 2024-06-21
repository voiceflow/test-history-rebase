import type { Nullish, Struct } from '@voiceflow/common';
import type { UpdateFilter } from 'mongodb';

export interface SetOperation {
  path: string | Array<string | Struct>;
  value: unknown;
}

export interface PullOperation {
  path: string;
  match: unknown;
}

export interface PullAllOperation {
  path: string;
  match: unknown[];
}

export interface AddToSetOperation {
  path: string;
  value: unknown | Array<unknown>;
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

export type UpdateOperationType = keyof UpdateFilter<any>;

export interface UpdateOperation<K extends UpdateOperationType> {
  query: UpdateFilter<any>[K];
  operation: K;
  arrayFilters: Struct[];
}
