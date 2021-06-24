import { Referral, StripeCoupon, StripeProduct } from '@/models';

export type ReferralState = {
  coupons: StripeCoupon[];
  products: StripeProduct[];
  referrals: Referral[];
};
