import type { Language, ObjectResource } from './Base';

export interface EntityVariantMigrationData extends ObjectResource {
  language: Language;
  value: string;
  synonyms: string[];
  entityID: string;
  assistantID: string;
}

export interface EntityMigrationData {
  name: string;
  color: string;
  isArray: boolean;
  folderID: string | null;
  variants: Pick<EntityVariantMigrationData, 'value' | 'synonyms'>[];
  classifier: string | null;
  description: string | null;
}
