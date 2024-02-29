import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { CONTRIES_MAPPER, toast } from '@voiceflow/ui';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { designerClient } from '@/client/designer';
import { ACTIVE_PAID_PLAN, UNLIMITED_EDITORS_CONST } from '@/constants';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { getClient as getChargebeeClient, initialize as initializeChargebee } from '@/vendors/chargebee';

import * as CardForm from './components/CardForm';
import { Step } from './Payment.constants';
import { PaymentModalPropsAPI } from './Payment.types';

type PriceMap = Record<BillingPeriod, { value: number; id: string }>;

export const stepAtom = atom(Step.PLAN);
export const editorSeatsAtom = atom(1);
export const periodAtom = atom(BillingPeriod.MONTHLY);
export const plansAtom = atom<BillingPlan[]>([]);
export const plansPricesAtom = atom<Record<string, PriceMap>>((get) => {
  return get(plansAtom).reduce((acc, plan) => {
    return {
      ...acc,
      [plan.id]: plan.prices.reduce(
        (acc, price) => ({
          ...acc,
          [price.period]: { value: price.period === BillingPeriod.ANNUALLY ? price.price / 12 : price.price, id: price.id },
        }),
        {}
      ),
    };
  }, {});
});
export const activePaidPlanPricesAtom = atom<PriceMap | null>((get) => get(plansPricesAtom)[ACTIVE_PAID_PLAN] ?? null);
export const selectedPlanPriceAtom = atom((get) => get(activePaidPlanPricesAtom)?.[get(periodAtom)] ?? null);

export const usePlans = () => {
  const [plans, setPlans] = useAtom(plansAtom);

  const fetchPlans = async () => {
    const plans = (await designerClient.billing.plan.getAllPlans()) as BillingPlan[];
    setPlans(plans);
  };

  const loadChargebee = () => {
    try {
      getChargebeeClient();
    } catch (error) {
      initializeChargebee();
    }
  };

  return { plans, fetchPlans, loadChargebee };
};

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalPropsAPI }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const selectedPlanPrice = useAtomValue(selectedPlanPriceAtom);
  const period = useAtomValue(periodAtom);
  const checkout = useDispatch(Organization.subscription.checkout);

  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(editorSeatsAtom);

  const onCheckout = async (cardValues: CardForm.Values) => {
    if (!organization || !organization.chargebeeSubscriptionID || !selectedPlanPrice) return;

    modalProps.api.preventClose();

    try {
      await checkout(
        organization.id,
        organization.chargebeeSubscriptionID,
        {
          number: cardValues.cardNumber,
          cvv: cardValues.cardCvv,
          expiryMonth: Number(cardValues.cardExpiry.split('/')[0]),
          expiryYear: Number(cardValues.cardExpiry.split('/')[1]),
          firstName: cardValues.name.split(' ')[0],
          lastName: cardValues.name.split(' ')[1],
          billingAddr1: cardValues.address,
          billingCity: cardValues.city,
          billingState: cardValues.state,
          billingCountry: CONTRIES_MAPPER[cardValues.country]?.code,
        },
        {
          editorSeats,
          itemPriceID: selectedPlanPrice.id,
          planPrice: selectedPlanPrice.value,
          period,
        }
      );

      if (modalProps.isTrialExpired) {
        trackingEvents.trackTrialExpiredUpgrade({ editorSeats });
      }

      modalProps.api.enableClose();
      modalProps.api.onClose();
    } catch (error) {
      modalProps.api.enableClose();
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return {
    onSubmit: onCheckout,
  };
};

export const usePaymentSteps = () => {
  const [activeStep, setActiveStep] = useAtom(stepAtom);

  const onNext = () => (activeStep === Step.PLAN ? setActiveStep(Step.BILLING) : setActiveStep(Step.PAYMENT));
  const onBack = () => setActiveStep(activeStep === Step.BILLING ? Step.PLAN : Step.BILLING);
  const onReset = () => setActiveStep(Step.PLAN);

  return {
    activeStep,
    onReset,
    onNext,
    onBack,
  };
};

export const usePricing = () => {
  const editorSeats = useAtomValue(editorSeatsAtom);
  const [period, setPeriod] = useAtom(periodAtom);
  const activePaidPlanPrices = useAtomValue(activePaidPlanPricesAtom);

  const periodPrice = (activePaidPlanPrices?.[period].value ?? 0) * (period === BillingPeriod.ANNUALLY ? 12 : 1);
  const price = periodPrice * editorSeats;

  const onChangePeriod = (period: BillingPeriod) => setPeriod(period);

  return {
    period,
    price,
    prices: Object.entries(activePaidPlanPrices || {})?.reduce<Record<BillingPeriod, number>>(
      (acc, [period, price]) => ({ ...acc, [period]: price.value }),
      {
        [BillingPeriod.ANNUALLY]: 0,
        [BillingPeriod.MONTHLY]: 0,
      }
    ),
    periodPrice,
    hasCard: false,
    onChangePeriod,
  };
};

export const useSeats = () => {
  const [selectedEditorSeats, setSelectedEditorSeats] = useAtom(editorSeatsAtom);
  const editorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const viewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);

  const usedEditorSeats = numberOfSeats === UNLIMITED_EDITORS_CONST ? editorSeats : numberOfSeats;
  const downgradedSeats = usedEditorSeats - editorSeats;

  const onChangeEditorSeats = (seats: number) => {
    setSelectedEditorSeats(seats);
  };

  useEffect(() => {
    setSelectedEditorSeats(editorSeats);
  }, []);

  return {
    selectedEditorSeats,
    downgradedSeats,
    editorSeats,
    usedEditorSeats,
    viewerSeats,
    editorPlanSeatLimits,
    onChangeEditorSeats,
  };
};
