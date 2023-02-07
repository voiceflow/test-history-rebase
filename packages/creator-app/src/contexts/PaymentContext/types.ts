import { Source } from '@stripe/stripe-js';

import { DBPaymentSource } from '@/models/Billing';

export type CreateFullSourceFunction = (cardHolderInfo: CardHolderInfo) => Promise<Source>;
export interface CardHolderInfo {
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface PaymentAPIContextType {
  isReady: boolean;
  createSource: () => Promise<Source>;
  paymentSource: DBPaymentSource | null;
  checkChargeable: (source: Pick<Source, 'id' | 'client_secret'>) => Promise<boolean>;
  createFullSource: CreateFullSourceFunction;
  refetchPaymentSource: () => Promise<void>;
}
