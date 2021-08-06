export interface Referral {
  referralCode: string;
  stripeCoupon: string | null;
  stripeProducts: string[];
  redemptionLimit: number | null;
  redemptions: number | null;
  expiry: number | null;
  status: boolean;
  creatorID?: number;
}
