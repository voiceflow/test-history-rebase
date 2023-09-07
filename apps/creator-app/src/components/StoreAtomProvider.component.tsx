import { useAtomValue } from 'jotai';

import { storAtom } from '@/atoms/store.atom';

// needed to initialize store listener
export const StoreAtomProvider = () => {
  useAtomValue(storAtom);

  return null;
};
