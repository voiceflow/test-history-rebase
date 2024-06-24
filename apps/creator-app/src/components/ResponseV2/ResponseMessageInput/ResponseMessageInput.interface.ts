import type { IMarkupInputWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables.interface';

export interface IResponseMessageInput
  extends Omit<IMarkupInputWithVariables, 'placeholder' | 'header' | 'footer' | 'pluginOptions'> {
  toolbar?: React.ReactNode;
  placeholder?: { default: string; focused: string } | string;
  canCreateVariables?: boolean;
}
