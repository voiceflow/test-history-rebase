import { useAtomValue } from 'jotai';

import { storeAtom } from '@/atoms/store.atom';

// needed to initialize store listener
export const StoreAtomProvider = () => {
  useAtomValue(storeAtom);

  return null;
};
