import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { ButtonVariant, toast, withContext } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import { receiptGraphic } from '@/assets';
import client from '@/client';
import { ModalType, UNLIMITED_EDITORS_CONST } from '@/constants';
import * as Payment from '@/contexts/PaymentContext';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { withStripe } from '@/hocs/withStripe';
import {
  useActiveWorkspace,
  useAsyncEffect,
  useDebouncedCallback,
  useDispatch,
  useEnableDisable,
  useModals,
  useSelector,
  useSmartReducer,
  useTrackingEvents,
} from '@/hooks';
import { useSuccessModal } from '@/ModalsV2/hooks';
import { DBPaymentSource } from '@/models/Billing';
import { getErrorMessage } from '@/utils/error';

export const PaymentContext = React.createContext<PaymentContextProps | null>(null);
export const { Consumer: PaymentContextConsumer } = PaymentContext;

export const VIEWS = {
  checkout: 'checkout',
  details: 'details',
};

const PRICE_UPDATE_DEBOUNCE_TIMEOUT = 300;

export interface PaymentPlan {
  pricing: Partial<Record<BillingPeriod, { price: number }>>;
  id: PlanType;
  images: string[];
  name: string;
  color?: string;
  summary: string;
  description: string;
  highlights: string[];
}

export interface PaymentDiscount {
  message: string;
  type: string;
  value: number;
}

export type PaymentErrors = Partial<Record<'seats' | 'coupon' | 'period', { message?: string }>>;

export interface PaymentContextProps {
  state: {
    hasPricing: boolean;
    loading: {
      price: boolean;
      checkout: boolean;
      plan: boolean;
    };

    // from smart reducer
    view: string;
    coupon: string;
    usingCoupon: boolean;
    errors: PaymentErrors;
    discount: PaymentDiscount;
    usingExistingSource: boolean;
    source: DBPaymentSource;
    plan: PaymentPlan;
    plans: PaymentPlan[];
    focus: string;
    price: number;
    period: BillingPeriod;
    seats: number;
    stripeCompleted: boolean;
    upgradePrompt: boolean;
  };
  actions: {
    showDetails: VoidFunction;
    showCheckout: VoidFunction;

    // from smart reducer
    setPeriod: (period: BillingPeriod) => void;
    setFocus: (focus: string) => void;
    setSeats: (seats: string) => void;
    setCoupon: (coupon: string | number) => void;
    setPlan: (plan: PaymentPlan) => void;
    toggleUsingCoupon: VoidFunction;
    setStripeCompleted: (complete: boolean) => void;
    toggleUsingExistingSource: VoidFunction;
    toggleUpgradePrompt: VoidFunction;
  };
  checkout: () => Promise<void>;
}

interface PaymentContextProviderProps {
  children: JSX.Element;
  onCheckout?: (message: string) => void;
}

const PaymentContextProvider: React.FC<PaymentContextProviderProps> = ({ children, onCheckout }) => {
  const paymentAPI = Payment.usePaymentAPI();
  const workspace = useActiveWorkspace();
  const referrerID = useSelector(Account.referrerIDSelector);
  const referralCode = useSelector(Account.referralCodeSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const checkoutWorkspace = useDispatch(Workspace.checkout);

  const [checkingOut, startCheckingOut, stopCheckingOut] = useEnableDisable(false);
  const [fetchingPrice, startFetchingPrice, stopFetchingPrice] = useEnableDisable(false);
  const [loadingPlan, startloadingPlan, stoploadingPlan] = useEnableDisable(true);

  const checkHash = React.useRef<string | null>(null);

  const successModal = useSuccessModal();
  const paymentsModal = useModals(ModalType.PAYMENT);

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
    upgradePrompt: false,
  });

  const [trackingEvents] = useTrackingEvents();

  // methods
  const updatePrice = useDebouncedCallback(
    PRICE_UPDATE_DEBOUNCE_TIMEOUT,
    async ({ plan, seats, period, coupon }) => {
      try {
        const hash = Utils.id.cuid.slug();
        checkHash.current = hash;
        startFetchingPrice();

        const { price, errors, discount } = await client.workspace.calculatePrice(workspace?.id ?? null, {
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
        actions.setErrors(getErrorMessage(err));
      } finally {
        stopFetchingPrice();
      }
    },
    [workspace]
  );

  const checkout = async () => {
    if (!workspace || !_isEmpty(state.errors) || !(state.stripeCompleted || state.usingExistingSource)) {
      return;
    }

    try {
      startCheckingOut();

      let source;
      if (!state.usingExistingSource) {
        source = await paymentAPI.createSource();

        await paymentAPI.checkChargeable(source);
      }

      await checkoutWorkspace({
        plan: state.plan.id,
        seats: state.seats,
        period: state.period,
        coupon: state.usingCoupon ? state.coupon : undefined,
        sourceID: source?.id ?? '',
        workspaceID: workspace.id,
      });

      const message = source?.id
        ? `Your Voiceflow ${state.plan.name} subscription has been activated.`
        : 'Your workspace has been successfully updated. Thank you.';

      if (onCheckout) {
        onCheckout(message);
      } else {
        paymentsModal.close();
        successModal.openVoid({ header: 'Payment Successful', message, icon: receiptGraphic, buttonVariant: ButtonVariant.TERTIARY });
      }

      trackingEvents.trackUpgrade({
        plan: state.plan.id,
        seats: Number(state.seats),
        period: state.period,
        coupon: state.coupon,
      });
    } catch (err) {
      stopCheckingOut();

      toast.error(getErrorMessage(err));
    }
  };

  const getPlans = async () => {
    const plans = await client.workspace.getPlans();
    const paidPlans = plans.filter(({ pricing }) => !!pricing);

    return paidPlans.filter(({ legacy, hidden }) => !(legacy || hidden));
  };

  // side effects
  useAsyncEffect(async () => {
    startloadingPlan();

    const plans = await getPlans();
    actions.setPlans(plans);

    if (!workspace?.id) {
      return;
    }

    try {
      // get the user's current plan and settings
      const { plan, period, seats, source } = await client.workspace.getPlan(workspace.id);

      let numberOfSeats = seats;
      let stripePromotion: string | null = null;

      if (numberOfSeats === UNLIMITED_EDITORS_CONST) {
        numberOfSeats = usedEditorSeats;
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
      datadogRum.addError(err);
      actions.setPlan(plans[0]);
    }

    stoploadingPlan();
  }, [workspace?.id]);

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

export const withPaymentProvider = (Component: React.ComponentType<any>) => {
  const PaymentContextProviderWithStripe = withStripe(PaymentContextProvider) as any;

  return (props: any) => (
    <PaymentContextProviderWithStripe onCheckout={props.onCheckout}>
      <Component {...props} />
    </PaymentContextProviderWithStripe>
  );
};

export const withPayment = withContext(PaymentContext, 'payment');
