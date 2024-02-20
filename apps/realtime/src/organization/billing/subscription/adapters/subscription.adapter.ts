import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import {
  findPlanItem,
  findRangeEntitlement,
  findSwitchEntitlement,
  getDaysLeftToTrialEnd,
  getPlanFromPriceID,
  getWorkspaceSeatsLimits,
  isChargebeeTrial,
} from '../subscription.utils';

const subscriptionAdapter = createMultiAdapter<Realtime.Identity.Subscription, Subscription>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems, metaData, hasScheduledChanges, subscriptionEntitlements }) => {
    const planItem = findPlanItem(subscriptionItems);
    const trialEnd = planItem?.trialEnd;

    const plan = getPlanFromPriceID(planItem?.itemPriceID);
    const isTrial = isChargebeeTrial(planItem, metaData);
    const seatLimits = getWorkspaceSeatsLimits(plan as PlanType);

    const agents = findRangeEntitlement(subscriptionEntitlements, 'agents');
    const interactionsLimit = findRangeEntitlement(subscriptionEntitlements, 'interactions-limit');
    const tokensLimit = findRangeEntitlement(subscriptionEntitlements, 'tokens-limit');
    const transcriptHistory = findRangeEntitlement(subscriptionEntitlements, 'transcript-history');
    const userPersonas = findRangeEntitlement(subscriptionEntitlements, 'user-personas');
    const workspaces = findRangeEntitlement(subscriptionEntitlements, 'workspaces');

    const agentExports = findSwitchEntitlement(subscriptionEntitlements, 'agent-exports');
    const claude1 = findSwitchEntitlement(subscriptionEntitlements, 'claude-1');
    const claude2 = findSwitchEntitlement(subscriptionEntitlements, 'claude-2');
    const claudeInstant = findSwitchEntitlement(subscriptionEntitlements, 'claude-instant');
    const gpt = findSwitchEntitlement(subscriptionEntitlements, 'chatgpt');
    const gpt4 = findSwitchEntitlement(subscriptionEntitlements, 'gpt-4-model');
    const gpt4Turbo = findSwitchEntitlement(subscriptionEntitlements, 'gpt-4-turbo');
    const knowledgeBaseUpload = findSwitchEntitlement(subscriptionEntitlements, 'knowledge-base-upload');
    const prototypeLinks = findSwitchEntitlement(subscriptionEntitlements, 'prototype-links');

    const result: Subscription = {
      id,
      billingPeriodUnit: billingPeriodUnit ?? null,
      editorSeats: planItem?.quantity ?? 1,
      pricePerEditor: planItem?.unitPrice ? planItem.unitPrice / 100 : 0,
      plan: metaData?.downgradedFromTrial ? PlanType.PRO : plan,
      nextBillingDate: nextBillingAt ? Realtime.Utils.date.to_DD_MMM_YYYY(new Date(nextBillingAt)) : null,
      status,
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
      planSeatLimits: seatLimits,
      entitlements: {
        agents,
        interactionsLimit,
        tokensLimit,
        transcriptHistory,
        userPersonas,
        workspaces,
        agentExports,
        claude1,
        claude2,
        claudeInstant,
        gpt,
        gpt4,
        gpt4Turbo,
        knowledgeBaseUpload,
        prototypeLinks,
      },
      hasScheduledChanges,
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
