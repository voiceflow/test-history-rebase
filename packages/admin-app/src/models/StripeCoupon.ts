export interface StripeCoupon {
  id: string;
  object: string;
  amount_off: null;
  created: number;
  currency: string | null;
  duration: string;
  duration_in_months: number | null;
  livemode: boolean;
  max_redemptions: null;
  metadata: any;
  name: string;
  owning_merchant?: string;
  owning_merchant_info?: string;
  percent_off: number;
  redeem_by: string | null;
  times_redeemed: number;
  valid: boolean;
  applies_to: {
    products: string[];
  };
}
