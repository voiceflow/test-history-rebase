export interface IEntityVariantInput {
  value: string;
  error?: string | null;
  onAdd: VoidFunction;
  onEmpty?: (isEmpty: boolean) => void;
  synonyms: string[];
  disabled?: boolean;
  autoFocus?: boolean;
  resetError?: VoidFunction;
  onValueChange: (value: string) => void;
  onSynonymsChange: (synonyms: string[]) => void;
}
