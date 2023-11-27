import { type EntityVariant } from '@voiceflow/dtos';

export type EntityVariantsSectionItem = Pick<EntityVariant, 'id' | 'value' | 'synonyms'>;

export interface IEntityVariantsSection<T extends EntityVariantsSectionItem> {
  name: string;
  onAdd: VoidFunction;
  onRemove: (id: string) => void;
  variants: T[];
  disabled?: boolean;
  classifier: string | null;
  onGenerated: (items: Omit<EntityVariantsSectionItem, 'id'>[]) => void;
  renderVariantInput: (props: { item: T; onEmpty: (value: boolean) => void; disabled?: boolean }) => React.ReactNode;
  autoScrollToTopRevision?: string;
}
