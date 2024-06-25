import type { Source } from '@stripe/stripe-js';

import type { DBPaymentSource, PlanSubscription } from '@/models';

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
  planSubscription: PlanSubscription | null;
  createFullSource: CreateFullSourceFunction;
  refetchPaymentSource: () => Promise<void>;
  updateWorkspaceSource: (source: Source) => Promise<void>;
  refetchPlanSubscription: () => Promise<void>;
  updatePlanSubscriptionSeats: (seats: number) => Promise<void>;
}
