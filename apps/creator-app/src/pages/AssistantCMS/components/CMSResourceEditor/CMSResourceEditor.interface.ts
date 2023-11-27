export interface ICMSResourceEditor {
  Editor: React.FC;
  children: React.ReactNode;
}

export interface ICMSResourceEditorScope {
  closePrevented: boolean;
  closeRequestHandlers: Array<() => boolean>;
}

export interface ICMSResourceEditorMolecule {
  useOnCloseRequest: (handler: () => boolean) => void;
  useSetClosePrevented: () => (value: boolean) => void;
  useOnClickClosePrevented: () => () => boolean;
}

export interface ICMSResourceEditorProvider {
  children: React.ReactNode;
}
