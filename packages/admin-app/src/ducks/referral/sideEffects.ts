import { toast } from '@voiceflow/ui';

import { Referral } from '@/client';
import { Option } from '@/constants';
import { Referral as ReferralType, StripeProduct } from '@/models';
import { ReferralForm } from '@/pages/Referral/types';
import { SyncThunk, Thunk } from '@/store/types';

import * as Actions from './actions';
import * as Selectors from './selectors';

export const sanitizeReferral = (referral: ReferralType, products: StripeProduct[]): ReferralType => {
  if (referral?.stripeProducts.length > 0) {
    return {
      ...referral,
      stripeProducts:
        referral?.stripeProducts
          ?.map((productID: string) => {
            const productDetails = products.find((product) => product.id === productID);

            return productDetails!.name;
          })
          .filter(Boolean) || [],
    };
  }

  return referral;
};

export const getStripeValues = (): Thunk => async (dispatch) => {
  try {
    const coupons = await Referral.getStripeCoupons();
    const products = await Referral.getStripeProducts();

    dispatch(Actions.updateCoupons({ coupons }));
    dispatch(Actions.updateStripeProducts({ products }));
  } catch (err) {
    toast.error('Unable to fetch Stripe coupon or product. Please refresh the page');
  }
};

export const setReferral =
  (formData: ReferralForm, callback: () => void): Thunk =>
  // eslint-disable-next-line consistent-return
  async (dispatch, getState) => {
    const state = getState();

    const products = Selectors.stripeProductsSelector(state);

    try {
      const referral = await Referral.setReferral(formData);

      dispatch(Actions.addReferral({ referral: sanitizeReferral(referral, products) }));

      if (referral.stripeCoupon && referral.creatorID) {
        toast.success('Successfully created: A referral code with promotion.');
      }

      if (referral.stripeCoupon && !referral.creatorID) {
        toast.success('Successfully created: A promotion code.');
      }

      if (referral.creatorID && !referral.stripeCoupon) {
        toast.success('Successfully created: A referral code with no promotion.');
      }

      return callback();
    } catch (err) {
      toast.error(err?.body?.data);
    }
  };

export const loadReferrals = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const products = Selectors.stripeProductsSelector(state);

  try {
    const referrals = await Referral.getReferrals();

    dispatch(
      Actions.setReferrals({
        referrals: referrals.map((referral: ReferralType) => sanitizeReferral(referral, products)),
      })
    );
  } catch (err) {
    toast.error('Unable to fetch referrals. Please refresh the page');
  }
};

export const updateReferral =
  (data: Pick<ReferralForm, 'status' | 'code'>): Thunk =>
  async (dispatch) => {
    try {
      await Referral.updateReferral(data);

      dispatch(Actions.updateReferralStatus(data));
    } catch (err) {
      toast.error('Something went wrong while updating referral. Please try again.');
    }
  };

export const getReferrals =
  (filter: Option): SyncThunk<ReferralType[]> =>
  (_, getState) => {
    const state = getState();

    const activeReferrals = Selectors.activeReferralsSelector(state);
    const inActiveReferrals = Selectors.inActiveReferralsSelector(state);

    if (filter === Option.INACTIVE) {
      return inActiveReferrals;
    }
    return activeReferrals;
  };

export const getReferralData = (): Thunk => async (dispatch) => {
  await dispatch(getStripeValues());
  await dispatch(loadReferrals());
};
