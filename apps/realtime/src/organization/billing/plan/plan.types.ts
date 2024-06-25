import type { BillingPeriodUnit } from '@voiceflow/dtos';

export interface PlanItemPrice {
  _id: string;
  id: string;
  name: string;
  item_family_id: string;
  item_id: string;
  status: string;
  external_name: string;
  pricing_model: string;
  price: number;
  period: number;
  currency_code: string;
  period_unit: BillingPeriodUnit;
  free_quantity: number;
  channel: string;
  resource_version: number;
  updated_at: number;
  created_at: number;
  is_taxable: boolean;
  item_type: string;
  show_description_in_invoices: boolean;
  show_description_in_quotes: boolean;
  object: string;
}

export interface PlanItemEntitlement {
  feature_id?: string;
  feature_name?: string;
  id: string;
  item_id?: string;
  item_type?: string;
  name?: string;
  value?: string;
}

export interface PlanMetadata {
  [key: string]: any;
}

export interface ChargebeePlan {
  _id: string;
  id: string;
  name: string;
  external_name: string;
  description: string;
  status: string;
  resource_version: number;
  updated_at: number;
  item_family_id: string;
  type: string;
  is_shippable: boolean;
  is_giftable: boolean;
  enabled_for_checkout: boolean;
  enabled_in_portal: boolean;
  item_applicability: string;
  metered: boolean;
  channel: string;
  metadata: PlanMetadata;
  object: string;
  item_entitlements: PlanItemEntitlement[];
  item_prices: PlanItemPrice[];
}
