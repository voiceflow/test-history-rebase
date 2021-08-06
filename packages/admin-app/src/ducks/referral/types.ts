import { Referral, StripeCoupon, StripeProduct } from '@/models';

export interface ReferralState {
  coupons: StripeCoupon[];
  products: StripeProduct[];
  referrals: Referral[];
}
