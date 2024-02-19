import { Identity } from '@realtime-sdk/models';
import { to_DD_MMM_YYYY } from '@realtime-sdk/utils/date';
import {
  findPlanItem,
  findRangeEntitlement,
  findSwitchEntitlement,
  getDaysLeftToTrialEnd,
  getPlanFromPriceID,
  getWorkspaceSeatsLimits,
  isChargebeeTrial,
} from '@realtime-sdk/utils/subscription';
import type { Subscription } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

const subscriptionAdapter = createMultiAdapter<Identity.Subscription, Subscription>(
  ({ id, billingPeriodUnit, status, nextBillingAt, subscriptionItems, metaData, hasScheduledChanges, subscriptionEntitlements }) => {
    const planItem = findPlanItem(subscriptionItems);
    const trialEnd = planItem?.trialEnd;

    const plan = getPlanFromPriceID(planItem?.itemPriceID);
    const isTrial = isChargebeeTrial(planItem, metaData);
    const seatLimits = getWorkspaceSeatsLimits(plan as PlanType);

    const agentExports = findSwitchEntitlement(subscriptionEntitlements, 'agent-exports');
    const agents = findRangeEntitlement(subscriptionEntitlements, 'agents');
    const claude1 = findSwitchEntitlement(subscriptionEntitlements, 'claude-1');
    const claude2 = findSwitchEntitlement(subscriptionEntitlements, 'claude-2');
    const claudeInstant = findSwitchEntitlement(subscriptionEntitlements, 'claude-instant');
    const gpt = findSwitchEntitlement(subscriptionEntitlements, 'chatgpt');
    const gpt4 = findSwitchEntitlement(subscriptionEntitlements, 'gpt-4-model');
    const gpt4Turbo = findSwitchEntitlement(subscriptionEntitlements, 'gpt-4-turbo');
    const interactionsLimit = findRangeEntitlement(subscriptionEntitlements, 'interactions-limit');
    const knowledgeBaseUpload = findSwitchEntitlement(subscriptionEntitlements, 'knowledge-base-upload');
    const prototypeLinks = findSwitchEntitlement(subscriptionEntitlements, 'prototype-links');
    const tokensLimit = findRangeEntitlement(subscriptionEntitlements, 'tokens-limit');
    const transcriptHistory = findRangeEntitlement(subscriptionEntitlements, 'transcript-history');
    const userPersonas = findRangeEntitlement(subscriptionEntitlements, 'user-personas');
    const workspaces = findRangeEntitlement(subscriptionEntitlements, 'workspaces');

    const result: Subscription = {
      id,
      billingPeriodUnit: billingPeriodUnit ?? null,
      editorSeats: planItem?.quantity ?? 1,
      pricePerEditor: planItem?.unitPrice ? planItem.unitPrice / 100 : 0,
      plan: metaData?.downgradedFromTrial ? PlanType.PRO : plan,
      nextBillingDate: nextBillingAt ? to_DD_MMM_YYYY(new Date(nextBillingAt)) : null,
      status,
      trial: isTrial && trialEnd ? { daysLeft: getDaysLeftToTrialEnd(new Date(trialEnd)), endAt: new Date(trialEnd).toJSON() } : null,
      planSeatLimits: seatLimits,
      hasScheduledChanges,
      entitlements: {
        agentExports,
        agents,
        claude1,
        claude2,
        claudeInstant,
        gpt,
        gpt4,
        gpt4Turbo,
        interactionsLimit,
        knowledgeBaseUpload,
        prototypeLinks,
        tokensLimit,
        transcriptHistory,
        userPersonas,
        workspaces,
      },
    };

    return result;
  },
  notImplementedAdapter.transformer
);

export default subscriptionAdapter;
