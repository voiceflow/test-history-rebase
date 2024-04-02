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

export interface SubscriptionPaymentSource {
  _id: string;
  id: string;
  card: {
    iin: string;
    last4: string;
    funding_type: string;
    expiry_month: number;
    expiry_year: number;
    billing_addr1: string;
    billing_city: string;
    billing_state_code: string;
    billing_state: string;
    billing_country: string;
    masked_number: string;
    object: string;
    brand: string;
  };
  created_at: number;
  customer_id: string;
  deleted: boolean;
  gateway: string;
  gateway_account_id: string;
  object: string;
  reference_id: string;
  resource_version: number;
  status: string;
  type: string;
  updated_at: number;
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
  paymentSource?: SubscriptionPaymentSource;
  customer: {
    cfOrganizationID?: string;
  };

  customerID: string;

  subscriptionEntitlements?: SubscriptionEntitlement[];

  resourceVersion?: number;

  metaData?: Record<string, unknown>;

  onDunningPeriod: boolean;
}
