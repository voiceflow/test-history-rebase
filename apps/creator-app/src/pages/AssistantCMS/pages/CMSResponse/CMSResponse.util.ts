import { markupToString } from '@voiceflow/utils-designer';
import type { Descendant } from 'slate';

import { markupToSlate } from '@/utils/markup.util';

import type { CMSResponse } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';
import type { CMSResponseSearchContext, CMSResponseSortContext } from './CMSResponse.interface';

export const responseToVariantString = (
  item: CMSResponse,
  { entitiesMapByID, variablesMapByID, getVariantByResponseID }: CMSResponseSortContext
): string => {
  const variant = getVariantByResponseID({ responseID: item.id });

  if (!variant) return '';

  return markupToString.fromDB(variant.text, { variablesMapByID, entitiesMapByID });
};

export const responseToVariantSlate = (
  item: CMSResponse,
  { getVariantByResponseID }: CMSResponseSortContext
): Descendant[] => {
  const variant = getVariantByResponseID({ responseID: item.id });

  if (!variant) return [];

  return markupToSlate.fromDB(variant.text);
};

export const responseSearch = withFolderSearch<CMSResponse, CMSResponseSearchContext>((item, context) => {
  if (item.name.toLocaleLowerCase().includes(context.search)) return true;

  // TODO: add memoization
  const variantText = responseToVariantString(item, context);

  return !!variantText && variantText.toLocaleLowerCase().includes(context.search);
});
