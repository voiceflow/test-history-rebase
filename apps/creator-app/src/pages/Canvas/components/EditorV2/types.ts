export type { DefaultFooterTypes as DefaultFooter } from './components';

export interface Props extends React.PropsWithChildren {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fillHeight?: boolean;
  dropLagAccept?: string | string[];
  disableAnimation?: boolean;
  withoutContentContainer?: boolean;
}
