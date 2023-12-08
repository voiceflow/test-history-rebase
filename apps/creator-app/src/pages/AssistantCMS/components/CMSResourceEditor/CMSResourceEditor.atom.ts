import { usePersistFunction } from '@voiceflow/ui-next';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { createScope, molecule } from 'jotai-molecules';
import { createRef, useEffect } from 'react';

import type { ICMSResourceEditorMolecule, ICMSResourceEditorScope } from './CMSResourceEditor.interface';

export const CMSResourceEditorScope = createScope<ICMSResourceEditorScope>({
  drawerRef: createRef<HTMLDivElement>(),
  closePrevented: false,
  closeRequestHandlers: [],
});

export const CMSResourceEditorMolecule = molecule<ICMSResourceEditorMolecule>((_, getScope): ICMSResourceEditorMolecule => {
  const scope = getScope(CMSResourceEditorScope);

  const closePrevented = atom(scope.closePrevented);
  const closeRequestHandlers = atom(scope.closeRequestHandlers);

  return {
    drawerRef: scope.drawerRef,

    useOnCloseRequest: (handler) => {
      const setAtom = useSetAtom(closeRequestHandlers);
      const persistedHandler = usePersistFunction(handler);

      useEffect(() => {
        setAtom((handlers) => [...handlers, persistedHandler]);

        return () => {
          setAtom((handlers) => handlers.filter((h) => h !== persistedHandler));
        };
      }, []);
    },

    useSetClosePrevented: () => useSetAtom(closePrevented),

    useOnClickClosePrevented: () => {
      const handlers = useAtomValue(closeRequestHandlers);
      const prevented = useAtomValue(closePrevented);

      return () => prevented || handlers.some((handler) => handler() === false);
    },
  };
});
