import { IResponseCreateVariant } from '@/components/Response/ResponseCreateVariant/ResponseCreateVariant.interface';

export interface IIntentRequiredEntityRepromptsPopper {
  children: React.ReactNode;
  entityID: string;
  entityIDs: string[];
  reprompts: IResponseCreateVariant['variant'][];
  entityName: string;
  onRepromptAdd: VoidFunction;
  onEntityReplace: (props: { oldEntityID: string; entityID: string }) => void;
}
