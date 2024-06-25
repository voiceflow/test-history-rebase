import { markupToString } from '@voiceflow/utils-designer';
import type { Descendant } from 'slate';

import { markupToSlate } from '@/utils/markup.util';

import type { CMSMessage } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';
import type { CMSMessageSearchContext, CMSMessageSortContext } from './CMSMessage.interface';

export const responseToVariantString = (
  item: CMSMessage,
  { entitiesMapByID, variablesMapByID, getVariantByResponseID }: CMSMessageSortContext
): string => {
  const variant = getVariantByResponseID({ responseID: item.id });

  if (!variant) return '';

  return markupToString.fromDB(variant.text, { variablesMapByID, entitiesMapByID });
};

export const responseToVariantSlate = (
  item: CMSMessage,
  { getVariantByResponseID }: CMSMessageSortContext
): Descendant[] => {
  const variant = getVariantByResponseID({ responseID: item.id });

  if (!variant) return [];

  return markupToSlate.fromDB(variant.text);
};

export const responseSearch = withFolderSearch<CMSMessage, CMSMessageSearchContext>((item, context) => {
  if (item.name.toLocaleLowerCase().includes(context.search)) return true;

  // TODO: add memoization
  const variantText = responseToVariantString(item, context);

  return !!variantText && variantText.toLocaleLowerCase().includes(context.search);
});
