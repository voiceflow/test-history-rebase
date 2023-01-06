import * as Realtime from '@voiceflow/realtime-sdk';
import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useFeature, useSelector } from '@/hooks';

import { CountdownContainer, CountdownIcon, CountdownText } from './components';
import { CountdownStatus, MIN_TRIAL_DAYS, TRIAL_DAYS_WARNING } from './constants';

const OrganizationTrialCountdown: React.OldFC = () => {
  const { isEnabled: isEnterpriseTrialEnabled } = useFeature(Realtime.FeatureFlag.ENTERPRISE_TRIAL);
  const trialDaysLeft = useSelector(WorkspaceV2.active.organizationTrialDaysLeft);

  const countdownStatus = React.useMemo(() => {
    if (trialDaysLeft == null) return;
    if (trialDaysLeft <= MIN_TRIAL_DAYS) return CountdownStatus.EXPIRED;
    if (trialDaysLeft <= TRIAL_DAYS_WARNING) return CountdownStatus.WARNING;
    return CountdownStatus.FULL;
  }, [trialDaysLeft]);

  if (!isEnterpriseTrialEnabled || trialDaysLeft == null) return null;

  return (
    <CountdownContainer>
      <TippyTooltip content="Days left in trial" position="bottom">
        <CountdownIcon status={countdownStatus} daysLeft={trialDaysLeft}>
          {trialDaysLeft}
        </CountdownIcon>
      </TippyTooltip>
      <CountdownText status={countdownStatus}>{countdownStatus === CountdownStatus.EXPIRED ? 'Trial Expired' : 'Enterprise trial'}</CountdownText>
    </CountdownContainer>
  );
};

export default OrganizationTrialCountdown;
