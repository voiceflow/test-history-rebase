import type { Atom, PrimitiveAtom } from 'jotai';

import type { AnyModal } from '@/ModalsV2/types';

export interface ICMSResourceEditor {
  Editor: React.FC;
  children: React.ReactNode;
  drawerNode: PrimitiveAtom<HTMLDivElement | null>;
  modals?: Record<string, AnyModal>;
}

export interface ICMSResourceEditorScope {
  drawerNode: PrimitiveAtom<HTMLDivElement | null>;
}

export interface ICMSResourceEditorMolecule {
  drawerNode: Atom<HTMLDivElement | null>;
}

export interface ICMSResourceEditorProvider {
  children: React.ReactNode;
  drawerNode: PrimitiveAtom<HTMLDivElement | null>;
}
