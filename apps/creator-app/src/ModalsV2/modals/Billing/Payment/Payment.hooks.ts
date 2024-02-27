import { BillingPlan } from '@voiceflow/dtos';
import { BillingPeriod } from '@voiceflow/internal';
import { toast } from '@voiceflow/ui';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { designerClient } from '@/client/designer';
import { ACTIVE_PAID_PLAN, UNLIMITED_EDITORS_CONST } from '@/constants';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { getErrorMessage } from '@/utils/error';
import { getClient as getChargebeeClient, initialize as initializeChargebee } from '@/vendors/chargebee';

import * as CardForm from './components/CardForm';
import { Step } from './Payment.constants';
import { PaymentModalAPIProps } from './Payment.types';

type PriceMap = Record<BillingPeriod, { value: number; id: string }>;

export const stepAtom = atom(Step.PLAN);
export const editorSeatsAtom = atom(1);
export const periodAtom = atom(BillingPeriod.MONTHLY);
export const plansAtom = atom<BillingPlan[]>([]);
export const plansPriceAtom = atom<Record<string, PriceMap>>((get) => {
  return get(plansAtom).reduce((acc, plan) => {
    return {
      ...acc,
      [plan.id]: plan.price.reduce(
        (acc, price) => ({
          ...acc,
          [price.period]: { value: price.period === BillingPeriod.ANNUALLY ? price.price / 12 : price.price, id: price.id },
        }),
        {}
      ),
    };
  }, {});
});
export const activePaidPlanPricesAtom = atom<PriceMap | null>((get) => get(plansPriceAtom)[ACTIVE_PAID_PLAN] ?? null);
export const selectedPlanPriceAtom = atom((get) => get(activePaidPlanPricesAtom)?.[get(periodAtom)] ?? null);

export const usePlans = () => {
  const [plans, setPlans] = useAtom(plansAtom);

  const fetchPlans = async () => {
    const { billing: billingClient } = designerClient.billing;
    const plans = (await billingClient.getAllPlans()) as BillingPlan[];
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

export const useCheckoutPayment = ({ modalProps }: { modalProps: PaymentModalAPIProps }) => {
  const organization = useSelector(Organization.organizationSelector)!;
  const selectedPlanPrice = useAtomValue(selectedPlanPriceAtom);
  const period = useAtomValue(periodAtom);
  const checkout = useDispatch(Organization.subscription.checkout);

  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const [trackingEvents] = useTrackingEvents();
  const editorSeats = useAtomValue(editorSeatsAtom);

  const onCheckout = async () => {
    modalProps.api.preventClose();

    if (!organization || !organization.chargebeeSubscriptionID || !selectedPlanPrice) return;

    try {
      await checkout(organization.id, organization.chargebeeSubscriptionID, {
        editorSeats,
        itemPriceID: selectedPlanPrice.id,
        planPrice: selectedPlanPrice.value,
        period,
      });

      if (isTrialExpired) {
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

  const onSubmit = async (cardValues: CardForm.Values) => {
    if (!organization) return;

    modalProps.api.preventClose();

    try {
      await designerClient.billing.billing.upsertCard(organization.id, {
        json: {
          firstName: cardValues.name.split(' ')[0],
          lastName: cardValues.name.split(' ')[1],
          addressLine1: cardValues.address,
          billingCity: cardValues.city,
          billingStateCode: cardValues.state,
          billingState: cardValues.state,
          billingCountry: 'US',
          number: cardValues.cardNumber,
          expiryMonth: Number(cardValues.cardExpiry.split('/')[0]),
          expiryYear: Number(cardValues.cardExpiry.split('/')[1]),
          cvv: cardValues.cardCvv,
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
      return;
    }

    await onCheckout();
  };

  return {
    onSubmit,
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
    prices: Object.entries(activePaidPlanPrices || {})?.reduce((acc, [period, price]) => ({ ...acc, [period]: price.value }), {}),
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
