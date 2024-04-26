import { QuotaNames } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import type { BaseProps } from '@voiceflow/ui-next';
import { PrimaryNavigation, Tooltip } from '@voiceflow/ui-next';
import React from 'react';
import { match } from 'ts-pattern';

import { Permission } from '@/constants/permissions';
import { Workspace } from '@/ducks';
import { usePaymentModal, useTokensPurchaseModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { useActiveWorkspaceTokenUsage } from '@/hooks/workspace';
import { isStarterPlan } from '@/utils/plans';
import { onOpenBookDemoPage } from '@/utils/upgrade';

export const AssistantNavigationTokenUsage: React.FC<BaseProps> = ({ testID }) => {
  const tokenUsage = useActiveWorkspaceTokenUsage();
  const paymentModal = usePaymentModal();
  const [trackingEvents] = useTrackingEvents();
  const tokenPurchaseModal = useTokensPurchaseModal();
  const [canConfigureWorkspaceBilling] = usePermission(Permission.CONFIGURE_WORKSPACE_BILLING);

  const plan = useSelector(Workspace.active.planSelector);
  const isOnProTrial = useSelector(Workspace.active.isOnProTrialSelector);
  const isProWorkspace = useSelector(Workspace.active.isProSelector);

  const refreshWorkspaceQuotaDetails = useDispatch(Workspace.refreshWorkspaceQuotaDetails);

  const onTooltipOpen = () => {
    refreshWorkspaceQuotaDetails(QuotaNames.TOKENS);
    trackingEvents.trackAIQuotaCheck({ quota: tokenUsage.quota, consume: tokenUsage.consumed });
  };

  const onClick = () => {
    if (isOnProTrial || isStarterPlan(plan)) {
      paymentModal.openVoid({});
    } else if (isProWorkspace) {
      if (canConfigureWorkspaceBilling) {
        tokenPurchaseModal.openVoid({});
      }
    } else {
      onOpenBookDemoPage();
    }
  };

  React.useEffect(() => {
    let timer: number | null = null;

    const fetchNextQuota = async () => {
      timer = window.setTimeout(async () => {
        await refreshWorkspaceQuotaDetails(QuotaNames.TOKENS);

        fetchNextQuota();
      }, 60000);
    };

    fetchNextQuota();

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <PrimaryNavigation.Item.TokenUsage
      limit={tokenUsage.quota}
      usage={tokenUsage.consumed}
      testID={testID}
      onClick={onClick}
      onTooltipOpen={onTooltipOpen}
      addTokensButton={match(null)
        // show upgrade to pro button if user is on pro trial or is on starter plan
        .when(
          () => isOnProTrial || isStarterPlan(plan),
          () => (
            <Tooltip.Button
              size="small"
              label="Upgrade to pro"
              testID={tid(testID, 'upgrade')}
              onClick={() => paymentModal.openVoid({})}
            />
          )
        )
        // show add tokens button if user is on pro workspace
        .when(
          () => isProWorkspace,
          () => (
            <Tooltip
              referenceElement={({ ref, onOpen, onClose }) => (
                <Tooltip.Button
                  ref={ref}
                  size="small"
                  label="Add tokens"
                  testID={tid(testID, 'purchase-tokens')}
                  onClick={() => tokenPurchaseModal.openVoid({})}
                  disabled={!canConfigureWorkspaceBilling}
                  onPointerEnter={canConfigureWorkspaceBilling ? undefined : onOpen}
                  onPointerLeave={onClose}
                />
              )}
            >
              {() => (
                <Tooltip.Caption mb={0}>
                  Only workspace admins can add more tokens. Ask your admin to purchase a top-up.
                </Tooltip.Caption>
              )}
            </Tooltip>
          )
        )
        // show contact sales button otherwise
        .otherwise(() => (
          <Tooltip.Button
            size="small"
            label="Contact sales"
            testID={tid(testID, 'contact-sales')}
            onClick={onOpenBookDemoPage}
          />
        ))}
    />
  );
};
