export interface ICMSEditorMoreButton {
  disabled?: boolean;
  children: (props: { onClose: VoidFunction }) => React.ReactNode;
}
