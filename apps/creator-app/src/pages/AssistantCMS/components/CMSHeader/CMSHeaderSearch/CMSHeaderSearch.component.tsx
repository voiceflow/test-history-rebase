import { SearchInput } from '@voiceflow/ui-next';
import { useAtom } from 'jotai';
import React, { useRef } from 'react';

import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { useCMSManager } from '../../../contexts/CMSManager';
import type { ICMSHeaderSearch } from './CMSHeaderSearch.interface';

export const CMSHeaderSearch: React.FC<ICMSHeaderSearch> = ({ placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const cmsManager = useCMSManager();
  const [search, setSearch] = useAtom(cmsManager.originalSearch);

  useHotkey(
    Hotkey.NATIVE_SEARCH,
    () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    { allowInputs: true, preventDefault: true }
  );

  return <SearchInput ref={inputRef} variant="dark" value={search} placeholder={placeholder} onValueChange={setSearch} />;
};
