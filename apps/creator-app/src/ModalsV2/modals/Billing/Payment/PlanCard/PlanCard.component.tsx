import { Box } from '@voiceflow/ui';
import React from 'react';

import * as currency from '@/utils/currency';

import * as S from './PlanCard.styles';

interface PlanCardProps extends React.PropsWithChildren {
  title: React.ReactNode;
  amount: number | null;
  badge?: React.ReactNode;
  period?: 'm' | 'y';
  active?: boolean;
  onClick?: VoidFunction;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  title,
  amount,
  badge,
  period = 'm',
  active = false,
  children,
  onClick,
}) => (
  <S.Container $active={active} onClick={onClick}>
    <Box.FlexApart mb={4}>
      <Box.Flex gap={8}>
        <S.Title>{title}</S.Title>

        {badge}
      </Box.Flex>

      <S.Period>
        <S.Title>{amount !== null ? currency.formatUSD(amount, { noDecimal: true, unit: 'cent' }) : '-'}</S.Title>/
        {period}
      </S.Period>
    </Box.FlexApart>

    <S.Description>{children}</S.Description>
  </S.Container>
);
