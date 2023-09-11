import { IResponseCreateVariant } from '@/components/Response/ResponseCreateVariant/ResponseCreateVariant.interface';

export interface IIntentRequiredEntityRepromptsPopper {
  children: () => React.ReactNode;
  reprompts: IResponseCreateVariant['variant'][];
  entityName: string;
  onRepromptAdd: VoidFunction;
}
