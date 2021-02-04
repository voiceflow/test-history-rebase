import { Referral, StripeCoupon, StripeProduct } from '@/admin/models';
import { ReferralForm } from '@/admin/pages/Referral/types';
import { api } from '@/client/fetch';

const REFERRAL_ENDPOINT = 'admin-api/referral';

const referralClient = {
  getStripeProducts: (): Promise<StripeProduct[]> => api.get(`${REFERRAL_ENDPOINT}/products`),
  getStripeCoupons: (): Promise<StripeCoupon[]> => api.get(`${REFERRAL_ENDPOINT}/coupons`),
  getReferrals: (): Promise<Referral[]> => api.get(`${REFERRAL_ENDPOINT}/all`),
  setReferral: (data: ReferralForm): Promise<Referral> => api.post(`${REFERRAL_ENDPOINT}/create`, { data }),
  updateReferral: (data: Pick<ReferralForm, 'status' | 'code'>) => api.post(`${REFERRAL_ENDPOINT}/update`, { data }),
};

export default referralClient;
