import { Button, ProgressBar } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import { COLORS, TOTAL_TRIAL_DAYS } from './constants';
import * as S from './styles';

// we need to display a min progress bar when it's expired
const MIN_PROGRESS = 2 / TOTAL_TRIAL_DAYS;
interface TrialCountdownCardProps {
  onClick?: VoidFunction;
  daysLeft: number;
}

const TrialCountdownCard: React.FC<TrialCountdownCardProps> = ({ onClick, daysLeft }) => (
  <S.CardContainer>
    <S.CountdownText>
      <S.DaysContainer>{daysLeft}</S.DaysContainer> {pluralize('day', daysLeft)} left on free trial
    </S.CountdownText>

    <S.ProgressContainer>
      <ProgressBar
        width={174}
        height={3}
        background="#5D6264"
        color={COLORS[Math.min(TOTAL_TRIAL_DAYS, daysLeft)]}
        progress={Math.max(daysLeft / TOTAL_TRIAL_DAYS, MIN_PROGRESS)}
      />
    </S.ProgressContainer>
    {onClick && <Button.DarkButton onClick={() => onClick()}>Upgrade Now</Button.DarkButton>}
  </S.CardContainer>
);

export default TrialCountdownCard;
