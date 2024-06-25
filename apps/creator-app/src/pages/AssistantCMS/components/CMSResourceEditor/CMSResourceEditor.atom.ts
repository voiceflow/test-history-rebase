import { atom } from 'jotai';
import { createScope, molecule } from 'jotai-molecules';

import type { ICMSResourceEditorMolecule, ICMSResourceEditorScope } from './CMSResourceEditor.interface';

export const CMSResourceEditorScope = createScope<ICMSResourceEditorScope>({
  drawerNode: atom<HTMLDivElement | null>(null),
});

export const CMSResourceEditorMolecule = molecule<ICMSResourceEditorMolecule>(
  (_, getScope): ICMSResourceEditorMolecule => {
    const scope = getScope(CMSResourceEditorScope);

    return {
      drawerNode: scope.drawerNode,
    };
  }
);
