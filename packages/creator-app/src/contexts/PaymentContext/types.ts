import { Source } from '@stripe/stripe-js';

import { DBPaymentSource } from '@/models/Billing';

export type CreateFullSourceFunction = (cardHolderInfo: CardHolderInfo) => Promise<Source>;
export interface CardHolderInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface PaymentAPIContextType {
  checkChargeable: (source: Pick<Source, 'id' | 'client_secret'>) => Promise<boolean>;
  createSource: () => Promise<Source>;
  paymentSource: DBPaymentSource | null;
  refetchPaymentSource: () => Promise<void>;
  createFullSource: CreateFullSourceFunction;
  isReady: boolean;
}
