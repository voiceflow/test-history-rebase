export interface ITipPortal {
  scope: string;
  closing?: boolean;
  children: (props: { onClose: VoidFunction }) => React.ReactNode;
}
