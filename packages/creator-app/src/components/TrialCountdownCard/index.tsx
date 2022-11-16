import { Button, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { CountdownColors, TOTAL_TRIAL_DAYS } from './constants';
import { CardContainer, CountdownText, DaysContainer, StrengthContainer } from './styles';

const TrialCountdownCard: React.FC = () => {
  const trialDaysLeft = useSelector(WorkspaceV2.active.organizationTrialDaysLeft);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);

  return trialDaysLeft ? (
    <CardContainer>
      <CountdownText>
        <DaysContainer>{trialDaysLeft}</DaysContainer> days left on free trial
      </CountdownText>
      <StrengthContainer>
        <StrengthGauge
          width={174}
          thickness={3}
          background="#5D6264"
          customColor={CountdownColors[trialDaysLeft]}
          customLevel={trialDaysLeft / TOTAL_TRIAL_DAYS}
        />
      </StrengthContainer>
      <Button.DarkButton onClick={() => paymentModal.open({})}>Upgrade Now</Button.DarkButton>
    </CardContainer>
  ) : (
    <></>
  );
};

export default TrialCountdownCard;
