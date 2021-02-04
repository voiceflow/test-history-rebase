import { Referral, StripeCoupon, StripeProduct } from '@/admin/models';
import { createAction } from '@/ducks/utils';
import { Action, ActionPayload } from '@/store/types';

export enum ReferralAction {
  UPDATE_COUPONS = 'COUPONS:UPDATE',
  UPDATE_PRODUCTS = 'PRODUCTS:UPDATE',
  SET_REFERRALS = 'REFERRALS:SET',
  ADD_REFERRAL = 'REFERRAL:ADD',
  UPDATE_REFERRAL_STATUS = 'REFERRAL:UPDATE:STATUS',
}

// action types

export type UpdateCoupons = Action<ReferralAction.UPDATE_COUPONS, { coupons: StripeCoupon[] }>;

export type UpdateProducts = Action<ReferralAction.UPDATE_PRODUCTS, { products: StripeProduct[] }>;

export type SetReferrals = Action<ReferralAction.SET_REFERRALS, { referrals: Referral[] }>;

export type AddReferral = Action<ReferralAction.ADD_REFERRAL, { referral: Referral }>;

export type UpdateReferralStatus = Action<ReferralAction.UPDATE_REFERRAL_STATUS, { status: boolean; code: string }>;

export type AnyReferralAction = UpdateCoupons | UpdateProducts | SetReferrals | AddReferral | UpdateReferralStatus;

// action creators

export const updateStripeProducts = (payload: ActionPayload<UpdateProducts>): UpdateProducts => createAction(ReferralAction.UPDATE_PRODUCTS, payload);

export const updateCoupons = (payload: ActionPayload<UpdateCoupons>): UpdateCoupons => createAction(ReferralAction.UPDATE_COUPONS, payload);

export const setReferrals = (payload: ActionPayload<SetReferrals>): SetReferrals => createAction(ReferralAction.SET_REFERRALS, payload);

export const addReferral = (payload: ActionPayload<AddReferral>): AddReferral => createAction(ReferralAction.ADD_REFERRAL, payload);

export const updateReferralStatus = (payload: ActionPayload<UpdateReferralStatus>): UpdateReferralStatus =>
  createAction(ReferralAction.UPDATE_REFERRAL_STATUS, payload);
