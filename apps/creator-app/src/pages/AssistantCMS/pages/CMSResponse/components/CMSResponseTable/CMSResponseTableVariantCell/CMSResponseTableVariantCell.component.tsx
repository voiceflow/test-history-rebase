import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { SlatePreviewWithVariables } from '@/components/State/SlatePreviewWithVariables';

import { cmsResponseSortContextAtom } from '../../../CMSResponse.atom';
import { responseToVariantSlate } from '../../../CMSResponse.util';
import type { ICMSResponseTableVariantCell } from './CMSResponseTableVariantCell.interface';

export const CMSResponseTableVariantCell: React.FC<ICMSResponseTableVariantCell> = ({ response }) => {
  const searchSortContext = useAtomValue(cmsResponseSortContextAtom);

  const slate = useMemo(() => responseToVariantSlate(response, searchSortContext), [response, searchSortContext]);

  return <SlatePreviewWithVariables value={slate} placeholder="Enter agent response" />;
};
