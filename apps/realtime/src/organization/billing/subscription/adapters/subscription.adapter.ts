import type { Subscription, SubscriptionPaymentMethodStatusType } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import {
  findBooleanEntitlement,
  findNumberEntitlement,
  findPlanItem,
  getBillingPeriodUnit,
  getDaysLeftToTrialEnd,
  getPlanFromPriceID,
  getStatus,
  isChargebeeTrial,
  isPaymentMethodFailed,
} from '../subscription.utils';

const subscriptionAdapter = createMultiAdapter<Realtime.Identity.Subscription, Subscription>(
  ({
    id,
    billingPeriodUnit,
    status,
    nextBillingAt,
    currentTermEnd,
    subscriptionItems,
    metaData,
    subscriptionEntitlements,
    paymentSource,
    customerID,
  }) => {
    const planItem = findPlanItem(subscriptionItems);
    const trialEnd = planItem?.trialEnd;

    const plan = getPlanFromPriceID(planItem?.itemPriceID);
    const isTrial = isChargebeeTrial(planItem, metaData);

    const samlSSO = findBooleanEntitlement(subscriptionEntitlements, 'feat-saml-sso');
    const claude1 = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-claude-1');
    const claude2 = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-claude-2');
    const claudeInstant = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-claude-instant');
    const gpt = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-gpt-3-5-turbo');
    const gpt4 = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-gpt-4');
    const gpt4Turbo = findBooleanEntitlement(subscriptionEntitlements, 'feat-model-gpt-4-turbo');

    const agentsLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-agent-count');
    const transcriptHistoryLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-transcript-history');
    const editorSeatsLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-editor-count');
    const personasLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-persona-count');
    const versionHistoryLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-version-history');
    const knowledgeBaseSourcesLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-knowledge-base-source-count');
    const workspacesLimit = findNumberEntitlement(subscriptionEntitlements, 'limit-workspace-count');

    const nextBillingTimestamp = nextBillingAt || currentTermEnd;

    const result: Subscription = {
      id,
      customerID,
      billingPeriodUnit: getBillingPeriodUnit(billingPeriodUnit),
      editorSeats: planItem?.quantity ?? 1,
      pricePerEditor: planItem?.unitPrice ? planItem.unitPrice / 100 : 0,
      plan: metaData?.downgradedFromTrial ? PlanType.PRO : plan,
      nextBillingDate: nextBillingTimestamp ? Realtime.Utils.date.to_DD_MMM_YYYY(new Date(nextBillingTimestamp)) : null,
      status: getStatus(status),
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
      paymentMethod: paymentSource && {
        id: paymentSource.id,
        status: paymentSource.status as SubscriptionPaymentMethodStatusType,
        failed: isPaymentMethodFailed(paymentSource.status as SubscriptionPaymentMethodStatusType),
        card: {
          brand: paymentSource.card.brand,
          expiryMonth: paymentSource.card.expiry_month,
          expiryYear: paymentSource.card.expiry_year,
          iin: paymentSource.card.iin,
          last4: paymentSource.card.last4,
          maskedNumber: paymentSource.card.masked_number,
        },
        billingAddress: {
          billingAddr1: paymentSource.card.billing_addr1,
          billingCity: paymentSource.card.billing_city,
          billingCountry: paymentSource.card.billing_country,
          billingState: paymentSource.card.billing_state,
          billingStateCode: paymentSource.card.billing_state_code,
        },
      },
      entitlements: {
        samlSSO,
        claude1,
        claude2,
        claudeInstant,
        gpt,
        gpt4,
        gpt4Turbo,
        agentsLimit,
        versionHistoryLimit,
        transcriptHistoryLimit,
        personasLimit,
        workspacesLimit,
        knowledgeBaseSourcesLimit,
        editorSeatsLimit,
      },
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
