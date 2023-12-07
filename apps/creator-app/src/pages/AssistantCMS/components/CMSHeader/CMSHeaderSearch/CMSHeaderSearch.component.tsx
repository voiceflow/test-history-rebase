import { SearchInput } from '@voiceflow/ui-next';
import { useAtom } from 'jotai';
import React from 'react';

import { useCMSManager } from '../../../contexts/CMSManager';
import type { ICMSHeaderSearch } from './CMSHeaderSearch.interface';

export const CMSHeaderSearch: React.FC<ICMSHeaderSearch> = ({ placeholder }) => {
  const cmsManager = useCMSManager();
  const [search, setSearch] = useAtom(cmsManager.originalSearch);

  return <SearchInput variant="dark" value={search} placeholder={placeholder} onValueChange={setSearch} />;
};
