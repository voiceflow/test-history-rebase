export interface IPreviewResultFooter {
  status: 'success' | 'error';
  latency: number;
  disabled?: boolean;
  children?: React.ReactNode;
}
