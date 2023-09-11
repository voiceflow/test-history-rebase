import type { Atom } from 'jotai/vanilla';
import { atom } from 'jotai/vanilla';

import { State as AppState } from '@/ducks';
import { store } from '@/setupStore';

export const storAtom = atom(store.getState());

storAtom.onMount = (setValue) => {
  const callback = () => setValue(store.getState());

  const unsubscribe = store.subscribe(callback);

  callback();

  return unsubscribe;
};

export const atomWithSelector = <State>(selector: (appState: AppState) => State): Atom<State> => atom((get) => selector(get(storAtom)));
