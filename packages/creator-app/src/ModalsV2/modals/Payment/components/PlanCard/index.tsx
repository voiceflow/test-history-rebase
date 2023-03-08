import { Box } from '@voiceflow/ui';
import React from 'react';

import * as currency from '@/utils/currency';

import * as S from './styles';

interface PlanCardProps extends React.PropsWithChildren {
  title: React.ReactNode;
  price: number | null;
  badge?: React.ReactNode;
  period?: React.ReactNode;
  active?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, price, badge, period = 'm', active = false, children }) => (
  <S.Container $active={active}>
    <Box.FlexApart mb={4}>
      <Box.Flex gap={8}>
        <S.Title>{title}</S.Title>

        {badge}
      </Box.Flex>

      <S.Period>
        <S.Title>{price !== null ? currency.formatUSD(price, { noDecimal: true }) : '-'}</S.Title>/{period}
      </S.Period>
    </Box.FlexApart>

    <S.Description>{children}</S.Description>
  </S.Container>
);

export default PlanCard;
