import { type EntityVariant } from '@voiceflow/dtos';

export type EntityVariantsSectionItem = Pick<EntityVariant, 'id' | 'value' | 'synonyms'>;

export interface IEntityVariantsSection<T extends EntityVariantsSectionItem> {
  name: string;
  variants: T[];
  disabled?: boolean;
  classifier: string | null;
  onVariantAdd: VoidFunction;
  onVariantRemove: (id: string) => void;
  onVariantImportMany: (items: Omit<EntityVariantsSectionItem, 'id'>[]) => Promise<EntityVariant[]> | void;
  renderVariantInput: (props: { item: T; onEmpty: (value: boolean) => void; disabled?: boolean }) => React.ReactNode;
  onVariantGeneratedMany: (items: Omit<EntityVariantsSectionItem, 'id'>[]) => void | Promise<any>;
  autoScrollToTopRevision?: string;
}
