import type { IBox } from '@voiceflow/ui-next';

export interface ICMSFormScrollSection extends IBox {
  pb: number;
  header: React.ReactNode;
  children: React.ReactNode;
  minHeight?: string;
}
