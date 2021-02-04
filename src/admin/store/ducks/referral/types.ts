import { Referral, StripeCoupon, StripeProduct } from '@/admin/models';

export type ReferralState = {
  coupons: StripeCoupon[];
  products: StripeProduct[];
  referrals: Referral[];
};
