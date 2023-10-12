import type { Markup, ObjectResource } from '@/common';

export interface EventMapping extends ObjectResource {
  path: Markup;
  variableID: string | null;
  eventID: string;
  assistantID: string;
}
