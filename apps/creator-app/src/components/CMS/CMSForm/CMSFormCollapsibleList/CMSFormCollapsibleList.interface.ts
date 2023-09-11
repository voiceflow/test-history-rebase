import type { ICollapsibleList } from '@voiceflow/ui-next/build/cjs/components/Section/CollapsibleList/CollapsibleList.interface';

export interface ICMSFormCollapsibleList<Item extends { id: string }> extends Omit<ICollapsibleList<Item>, 'footerClassName'> {
  autoScrollToTopRevision?: string;
}
