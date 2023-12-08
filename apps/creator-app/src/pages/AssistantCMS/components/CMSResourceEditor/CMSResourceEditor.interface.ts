export interface ICMSResourceEditor {
  Editor: React.FC;
  children: React.ReactNode;
  drawerRef: React.RefObject<HTMLDivElement>;
}

export interface ICMSResourceEditorScope {
  drawerRef: React.RefObject<HTMLDivElement>;
  closePrevented: boolean;
  closeRequestHandlers: Array<() => boolean>;
}

export interface ICMSResourceEditorMolecule {
  drawerRef: React.RefObject<HTMLDivElement>;
  useOnCloseRequest: (handler: () => boolean) => void;
  useSetClosePrevented: () => (value: boolean) => void;
  useOnClickClosePrevented: () => () => boolean;
}

export interface ICMSResourceEditorProvider {
  children: React.ReactNode;
  drawerRef: React.RefObject<HTMLDivElement>;
}
