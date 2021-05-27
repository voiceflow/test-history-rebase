import cuid from 'cuid';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';
import { compose } from 'recompose';

import { receiptGraphic } from '@/assets';
import client from '@/client';
import { ButtonVariant } from '@/components/Button';
import { toast } from '@/components/Toast';
import { BillingPeriod, ModalType, UNLIMITED_EDITORS_CONST, UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect, withContext, withProvider, withStripe } from '@/hocs';
import { useAsyncMountUnmount, useDebouncedCallback, useEnableDisable, useModals, useSmartReducer } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

export const PaymentContext = React.createContext(null);
export const { Consumer: PaymentContextConsumer } = PaymentContext;

export const VIEWS = {
  checkout: 'checkout',
  details: 'details',
};

const PRICE_UPDATE_DEBOUNCE_TIMEOUT = 300;

const PaymentContextProvider = ({ children, stripe, workspaceID, workspace, checkChargeable, loadActiveWorkspace, referrerID, referralCode }) => {
  const [checkingOut, startCheckingOut, stopCheckingOut] = useEnableDisable(false);
  const [fetchingPrice, startFetchingPrice, stopFetchingPrice] = useEnableDisable(false);
  const [loadingPlan, startloadingPlan, stoploadingPlan] = useEnableDisable(true);

  const checkHash = React.useRef(null);

  const { open: openSuccessModal } = useModals(ModalType.SUCCESS);
  const { close: closePaymentsModal } = useModals(ModalType.PAYMENT);

  const [state, actions] = useSmartReducer({
    view: VIEWS.checkout,
    plan: null,
    plans: [],
    focus: null,
    seats: 1,
    price: 0,
    period: BillingPeriod.ANNUALLY,
    errors: {},
    coupon: '',
    source: null,
    usingExistingSource: false,
    discount: null,
    usingCoupon: false,
    stripeCompleted: false,
  });

  // methods
  const updatePrice = useDebouncedCallback(
    PRICE_UPDATE_DEBOUNCE_TIMEOUT,
    async ({ plan, seats, period, coupon }) => {
      try {
        const hash = cuid.slug();
        checkHash.current = hash;
        startFetchingPrice();

        const { price, errors, discount } = await client.workspace.calculatePrice(workspaceID, {
          plan,
          seats,
          period,
          coupon: coupon || undefined,
          onlyVerified: true,
        });

        if (checkHash.current !== hash) {
          return;
        }

        actions.update({ price: Math.ceil(price / 100), errors, discount });
      } catch (err) {
        actions.setErrors(err?.body?.errors);
      } finally {
        stopFetchingPrice();
      }
    },
    [workspaceID]
  );

  const checkout = async () => {
    if (!_isEmpty(state.errors) || !(state.stripeCompleted || state.usingExistingSource)) {
      return;
    }

    try {
      startCheckingOut();

      let source;
      if (!state.usingExistingSource) {
        const stripeSource = await stripe.createSource({
          type: 'card',
        });
        source = stripeSource.source;
        if (!source) {
          throw new Error(stripeSource.error?.message || 'Invalid Card Information');
        }
        await checkChargeable(source);
      }

      await client.workspace.checkout(workspaceID, {
        plan: state.plan.id,
        seats: state.seats,
        period: state.period,
        coupon: state.usingCoupon ? state.coupon : undefined,
        source_id: source?.id,
      });

      loadActiveWorkspace();
      closePaymentsModal();

      const message = source?.id
        ? `Your Voiceflow ${state.plan.name} subscription has been activated.`
        : 'Your workspace has been successfully updated. Thank you.';

      openSuccessModal({ title: 'Payment Successful', message, icon: receiptGraphic, variant: ButtonVariant.TERTIARY });
    } catch (err) {
      stopCheckingOut();
      let error;

      if (err?.body?.errors) {
        error = Object.keys(err.body.errors)
          .map((key) => err.body.errors[key].message)
          .join('\n');
      }

      toast.error(error || err?.data?.data || err?.message);
    }
  };

  const getPlans = async () => {
    const plans = await client.workspace.getPlans();
    const paidPlans = plans.filter(({ pricing }) => !!pricing);

    return paidPlans.filter(({ legacy, hidden }) => !(legacy || hidden));
  };

  // side effects
  useAsyncMountUnmount(async () => {
    startloadingPlan();
    const plans = await getPlans();
    actions.setPlans(plans);

    try {
      // get the user's current plan and settings
      const { plan, period, seats, source } = await client.workspace.getPlan(workspaceID);

      let numberOfSeats = seats;
      let stripePromotion = '';
      if (numberOfSeats === UNLIMITED_EDITORS_CONST) {
        const editorCount = workspace.members.filter(({ role, creator_id }) => !!creator_id && (role === UserRole.EDITOR || role === UserRole.ADMIN))
          .length;
        numberOfSeats = editorCount;
      }

      // fetch promo code associated with referral code
      if (referrerID && referralCode) {
        stripePromotion = await client.user.getReferralCouponCode(referrerID, referralCode);
      }

      actions.update({
        plan: plans.find(({ id }) => id === plan) || plans[0],
        period: period || BillingPeriod.ANNUALLY,
        // Some users may have null seats in their plan (legacy), so default to 1
        seats: numberOfSeats || 1,
        source: source || null,
        usingExistingSource: !!source,
        usingCoupon: !!stripePromotion,
        coupon: stripePromotion ? referralCode : '',
      });
    } catch (err) {
      Sentry.error(err);
      actions.setPlan(plans[0]);
    }

    stoploadingPlan();
  });

  React.useEffect(() => {
    if (state.plan?.pricing) {
      startFetchingPrice();

      updatePrice({
        plan: state.plan.id,
        seats: state.seats,
        period: state.period,
        coupon: state.usingCoupon && state.coupon,
      });
    } else {
      actions.setPrice(null);
    }
  }, [state.plan, state.period]);

  React.useEffect(() => {
    if (state.plan?.pricing) {
      updatePrice({
        plan: state.plan.id,
        seats: state.seats,
        period: state.period,
        coupon: state.usingCoupon && state.coupon,
      });
    } else {
      actions.setPrice(null);
    }
  }, [state.seats, state.coupon, state.usingCoupon]);

  const showDetails = React.useCallback(() => actions.setView(VIEWS.details), []);
  const showCheckout = React.useCallback(() => actions.setView(VIEWS.checkout), []);

  const api = {
    state: {
      ...state,
      hasPricing: !!state.plan?.pricing,
      loading: {
        price: fetchingPrice,
        checkout: checkingOut,
        plan: loadingPlan,
      },
    },
    actions: {
      ...actions,
      showDetails,
      showCheckout,
    },
    checkout,
  };

  return <PaymentContext.Provider value={api}>{children}</PaymentContext.Provider>;
};

const mapStateToProps = {
  workspaceID: Session.activeWorkspaceIDSelector,
  workspace: Workspace.activeWorkspaceSelector,
  referrerID: Account.referrerIDSelector,
  referralCode: Account.referralCodeSelector,
};

const mapDispatchToProps = {
  loadActiveWorkspace: Workspace.loadActiveWorkspace,
};

export const withPaymentProvider = withProvider(compose(withStripe, connect(mapStateToProps, mapDispatchToProps))(PaymentContextProvider));

export const withPayment = withContext(PaymentContext, 'payment');
