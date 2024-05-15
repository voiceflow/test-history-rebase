import { SlateEditor } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { cmsResponseSortContextAtom } from '../../../CMSResponse.atom';
import { responseToVariantSlate } from '../../../CMSResponse.util';
import type { ICMSResponseTableVariantCell } from './CMSResponseTableVariantCell.interface';

export const CMSResponseTableVariantCell: React.FC<ICMSResponseTableVariantCell> = ({ response }) => {
  const searchSortContext = useAtomValue(cmsResponseSortContextAtom);

  const slate = useMemo(() => responseToVariantSlate(response, searchSortContext), [response, searchSortContext]);

  return <SlateEditor.Preview value={slate} placeholder="Enter agent response" />;
};
