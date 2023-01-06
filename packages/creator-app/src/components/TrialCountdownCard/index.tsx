import { Button, ProgressBar } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { CountdownColors, TOTAL_TRIAL_DAYS } from './constants';
import * as S from './styles';

const TrialCountdownCard: React.OldFC = () => {
  const trialDaysLeft = useSelector(WorkspaceV2.active.organizationTrialDaysLeft);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);

  if (!trialDaysLeft) return null;

  return (
    <S.CardContainer>
      <S.CountdownText>
        <S.DaysContainer>{trialDaysLeft}</S.DaysContainer> days left on free trial
      </S.CountdownText>

      <S.ProgressContainer>
        <ProgressBar width={174} height={3} background="#5D6264" color={CountdownColors[trialDaysLeft]} progress={trialDaysLeft / TOTAL_TRIAL_DAYS} />
      </S.ProgressContainer>

      <Button.DarkButton onClick={() => paymentModal.open({})}>Upgrade Now</Button.DarkButton>
    </S.CardContainer>
  );
};

export default TrialCountdownCard;
