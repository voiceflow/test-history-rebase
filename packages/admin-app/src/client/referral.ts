import { api } from '@/client/fetch';
import { Referral, StripeCoupon, StripeProduct } from '@/models';
import { ReferralForm } from '@/pages/Referral/types';

const REFERRAL_ENDPOINT = 'admin-api/referral';

const referralClient = {
  getStripeProducts: (): Promise<StripeProduct[]> => api.get(`${REFERRAL_ENDPOINT}/products`),
  getStripeCoupons: (): Promise<StripeCoupon[]> => api.get(`${REFERRAL_ENDPOINT}/coupons`),
  getReferrals: (): Promise<Referral[]> => api.get(`${REFERRAL_ENDPOINT}/all`),
  setReferral: (data: ReferralForm): Promise<Referral> => api.post(`${REFERRAL_ENDPOINT}/create`, { data }),
  updateReferral: (data: Pick<ReferralForm, 'status' | 'code'>) => api.post(`${REFERRAL_ENDPOINT}/update`, { data }),
};

export default referralClient;
