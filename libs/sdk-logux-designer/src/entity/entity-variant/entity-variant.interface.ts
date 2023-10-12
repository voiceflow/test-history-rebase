import type { Language, ObjectResource } from '@/common';

export interface EntityVariant extends ObjectResource {
  language: Language;
  value: string;
  synonyms: string[];
  entityID: string;
  assistantID: string;
}
