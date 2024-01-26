export interface SubscriptionItem {
  itemPriceID: string;
  itemType: string;
  quantity?: number;
  quantityInDecimal?: string;
  meteredQuantity?: string;
  lastCalculatedAt?: number;
  unitPrice?: number;
  unitPriceInDecimal?: string;
  amount?: number;
  amountInDecimal?: string;
  freeQuantity?: number;
  freeQuantityInDecimal?: string;
  trialEnd?: number;
  billingCycles?: number;
  servicePeriodDays?: number;
  chargeOnEvent?: string;
  chargeOnce?: boolean;
  chargeOnOption?: string;
}

export interface SubscriptionEntitlement {
  itemID?: string;
  itemType?: string;
  featureID?: string;
  featureName?: string;
  value?: string;
  feature?: {
    type?: string;
  };
}

export interface Subscription {
  id: string;
  status: string;
  startDate?: number;

  currentTermStart?: number;
  currentTermEnd?: number;

  nextBillingAt?: number;
  billingPeriodUnit?: string;

  trialStart?: number;
  trialEnd?: number;

  cancelledAt?: number;
  cancelReason?: string;

  subscriptionItems?: SubscriptionItem[];
  paymentSource?: Record<string, unknown>;
  customer: {
    cfOrganizationID?: string;
  };

  subscriptionEntitlements?: SubscriptionEntitlement[];

  metaData?: Record<string, unknown>;
}
