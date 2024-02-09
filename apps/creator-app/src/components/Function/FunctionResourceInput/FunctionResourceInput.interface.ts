import { BaseProps } from '@voiceflow/ui-next';

export interface IFunctionResourceInput extends BaseProps {
  onDescriptionChange: (description: string) => void;
  onValueChange: (value: string) => void;
  onEmpty?: (isEmpty: boolean) => void;
  descriptionPlaceholder: string;
  namePlaceholder: string;
  description: string;
  autoFocus?: boolean;
  value: string;
}
