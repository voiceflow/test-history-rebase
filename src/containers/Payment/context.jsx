import cuid from 'cuid';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';
import { compose } from 'recompose';

import client from '@/client';
import { toast } from '@/componentsV2/Toast';
import { MODALS, PERIOD } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';
import { activeWorkspaceIDSelector, fetchWorkspace } from '@/ducks/workspace';
import { connect, withContext, withProvider, withStripe } from '@/hocs';
import { useAsyncMountUnmount, useDebouncedCallback, useEnableDisable, useSmartReducer } from '@/hooks';

export const PaymentContext = React.createContext(null);
export const { Consumer: PaymentContextConsumer } = PaymentContext;

export const VIEWS = {
  checkout: 'checkout',
  details: 'details',
};

const PRICE_UPDATE_DEBOUNCE_TIMEOUT = 300;

const PaymentContextProvider = ({ children, stripe, workspaceID, checkChargeable, updateWorkspace }) => {
  const [checkingOut, startCheckingOut, stopCheckingOut] = useEnableDisable(false);
  const [fetchingPrice, startFetchingPrice, stopFetchingPrice] = useEnableDisable(false);
  const [loadingPlan, startloadingPlan, stoploadingPlan] = useEnableDisable(true);
  const { open: openSuccessModal } = useModals(MODALS.SUCCESS);
  const { close: closePaymentsModal } = useModals(MODALS.PAYMENT);

  const [state, actions] = useSmartReducer({
    view: VIEWS.checkout,
    plan: null,
    plans: [],
    focus: null,
    seats: 1,
    price: 0,
    period: PERIOD.monthly,
    errors: {},
    coupon: '',
    source: null,
    usingExistingSource: false,
    discount: null,
    usingCoupon: false,
    stripeCompleted: false,
  });

  const checkHash = React.useRef(null);

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

      updateWorkspace();
      closePaymentsModal();

      const message = source?.id
        ? `Your Voiceflow ${state.plan.name} plan has been activated. Thank you.`
        : 'Your workspace has been successfully updated. Thank you.';

      openSuccessModal({ title: 'Payment Successful', message });
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

  useAsyncMountUnmount(async () => {
    startloadingPlan();
    const plans = await client.workspace.getPlans();
    actions.setPlans(plans);

    try {
      // get the user's current plan and settings
      const { plan, period, seats, source } = await client.workspace.getPlan(workspaceID);

      actions.update({
        plan: plans.find(({ id }) => id === plan) || plans[0],
        period: period || PERIOD.monthly,
        seats: seats || 1,
        source: source || null,
        usingExistingSource: !!source,
      });
    } catch (err) {
      console.error(err);
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
  workspaceID: activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  updateWorkspace: fetchWorkspace,
};

export const withPaymentProvider = withProvider(
  compose(
    withStripe,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(PaymentContextProvider)
);

export const withPayment = withContext(PaymentContext, 'payment');
