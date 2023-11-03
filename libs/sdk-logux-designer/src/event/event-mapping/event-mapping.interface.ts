import type { Markup, ObjectResource } from '@/common';

export interface EventMapping extends ObjectResource {
  path: Markup;
  eventID: string;
  variableID: string | null;
  assistantID: string;
  environmentID: string;
}
