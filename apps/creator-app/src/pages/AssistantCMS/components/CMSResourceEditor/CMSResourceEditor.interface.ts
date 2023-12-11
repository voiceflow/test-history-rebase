import { Atom, PrimitiveAtom } from 'jotai';

export interface ICMSResourceEditor {
  Editor: React.FC;
  children: React.ReactNode;
  drawerNode: PrimitiveAtom<HTMLDivElement | null>;
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
