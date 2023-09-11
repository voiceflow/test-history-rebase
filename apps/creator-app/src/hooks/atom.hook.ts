import { usePersistFunction } from '@voiceflow/ui-next';
import type { Atom } from 'jotai';
import { useStore } from 'jotai';

export const useGetAtomValue = (): (<Value>(atom: Atom<Value>) => Value) => {
  const store = useStore();

  return usePersistFunction((atom: Atom<any>) => store.get(atom));
};
