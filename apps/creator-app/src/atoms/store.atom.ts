import type { Atom } from 'jotai/vanilla';
import { atom } from 'jotai/vanilla';

import { State as AppState } from '@/ducks';
import { store } from '@/setupStore';

export const storeAtom = atom(store.getState());

storeAtom.onMount = (setValue) => {
  const callback = () => setValue(store.getState());

  const unsubscribe = store.subscribe(callback);

  callback();

  return unsubscribe;
};

export const atomWithSelector = <State>(selector: (appState: AppState) => State): Atom<State> => atom((get) => selector(get(storeAtom)));
