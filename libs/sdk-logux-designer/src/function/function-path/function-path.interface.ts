import type { ObjectResource } from '@/common';

export interface FunctionPath extends ObjectResource {
  name: string;
  label: string | null;
  functionID: string;
  assistantID: string;
  environmentID: string;
}
