import { IconName } from '@voiceflow/icons';

export interface Props extends React.PropsWithChildren {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fillHeight?: boolean;
  dropLagAccept?: string | string[];
  disableAnimation?: boolean;
  withoutContentContainer?: boolean;
}

export interface EditorV3Action {
  label: string;
  icon: IconName;
  onClick: () => void;
}
