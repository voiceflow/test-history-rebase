import type { Language, ObjectResource } from '@/common';

export interface EntityVariant extends ObjectResource {
  value: string;
  language: Language;
  synonyms: string[];
  entityID: string;
  assistantID: string;
  environmentID: string;
}
