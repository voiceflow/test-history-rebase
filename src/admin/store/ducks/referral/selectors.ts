/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

import { createRootSelector } from '@/admin/store/utils';

import { STATE_KEY } from './constants';

const rootSelector = createRootSelector(STATE_KEY);

export const stripeProductsSelector = createSelector([rootSelector], ({ products }) => products);

export const stripeCouponsSelector = createSelector([rootSelector], ({ coupons }) => coupons);

export const referralsSelector = createSelector([rootSelector], ({ referrals }) => referrals || []);

export const activeReferralsSelector = createSelector([referralsSelector], (referrals) => referrals.filter((referral) => referral.status) || []);

export const inActiveReferralsSelector = createSelector([referralsSelector], (referrals) => referrals.filter((referral) => !referral.status) || []);
