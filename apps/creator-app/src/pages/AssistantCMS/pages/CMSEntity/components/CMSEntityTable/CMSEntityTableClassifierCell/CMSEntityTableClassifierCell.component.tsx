import { useAtomValue } from 'jotai';
import React from 'react';

import { entityClassifiersMapAtom } from '@/atoms/entity.atom';
import { CMSTableCellTextTooltip } from '@/pages/AssistantCMS/components/CMSTableCellTextTooltip/CMSTableCellTextTooltip.component';

import type { ICMSEntityTableClassifierCell } from './CMSEntityTableClassifierCell.interface';

export const CMSEntityTableClassifierCell: React.FC<ICMSEntityTableClassifierCell> = ({ classifier }) => {
  const entityClassifiersMap = useAtomValue(entityClassifiersMapAtom);

  return (
    <CMSTableCellTextTooltip label={classifier ? entityClassifiersMap[classifier]?.label ?? 'Custom' : 'Custom'} />
  );
};
