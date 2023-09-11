export interface IEntityVariantInput {
  value: string;
  onEmpty?: (isEmpty: boolean) => void;
  synonyms: string[];
  autoFocus?: boolean;
  onValueChange: (value: string) => void;
  onSynonymsChange: (synonyms: string[]) => void;
}
