import type { Markup, ObjectResource } from '@/common';

export interface CardButton extends ObjectResource {
  label: Markup;
  cardID: string;
  assistantID: string;
}
