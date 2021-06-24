import { RootReducer } from '@voiceflow/ui';

import { AnyReferralAction, ReferralAction } from './actions';
import { INITIAL_STATE } from './constants';
import { ReferralState } from './types';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const referralReducer: RootReducer<ReferralState, AnyReferralAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ReferralAction.UPDATE_COUPONS:
      return {
        ...state,
        coupons: action.payload.coupons,
      };
    case ReferralAction.UPDATE_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
      };
    case ReferralAction.SET_REFERRALS:
      return {
        ...state,
        referrals: action.payload.referrals.reverse(),
      };
    case ReferralAction.ADD_REFERRAL:
      return {
        ...state,
        referrals: [action.payload.referral, ...state.referrals],
      };
    case ReferralAction.UPDATE_REFERRAL_STATUS:
      return {
        ...state,
        referrals: state.referrals.map((referral) =>
          referral.referralCode === action.payload.code ? { ...referral, status: action.payload.status } : referral
        ),
      };
    default:
      return state;
  }
};

export default referralReducer;
