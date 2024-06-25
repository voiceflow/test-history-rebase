import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { SlatePreviewWithVariables } from '@/components/State/SlatePreviewWithVariables';

import { cmsResponseSortContextAtom } from '../../../CMSMessage.atom';
import { responseToVariantSlate } from '../../../CMSMessage.util';
import type { ICMSResponseTableVariantCell } from './CMSMessageTableVariantCell.interface';

export const CMSResponseTableVariantCell: React.FC<ICMSResponseTableVariantCell> = ({ response }) => {
  const searchSortContext = useAtomValue(cmsResponseSortContextAtom);

  const slate = useMemo(() => responseToVariantSlate(response, searchSortContext), [response, searchSortContext]);

  return <SlatePreviewWithVariables value={slate} placeholder="Enter agent response" />;
};
