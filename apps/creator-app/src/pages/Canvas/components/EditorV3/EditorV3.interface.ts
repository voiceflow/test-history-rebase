import type { IconName } from '@voiceflow/icons';

export interface IEditorV3 extends React.PropsWithChildren {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fillHeight?: boolean;
  dropLagAccept?: string | string[];
  disableAnimation?: boolean;
  withoutContentContainer?: boolean;
}

export interface EditorV3Action {
  icon: IconName;
  label: string;
  onClick: VoidFunction;
}
