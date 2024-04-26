import { SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import type { GraphResult } from '../../../types';
import { getLabelForPreviousPeriod } from '../../../utils';
import * as S from './styles';
import { getDeltaLabelColor } from './utils';

interface DeltaLabelProps {
  data: GraphResult;
  tileSize: 'small' | 'large';
}

const DeltaLabel: React.FC<DeltaLabelProps> = ({ data, tileSize }) => {
  if (!data.changeSincePreviousPeriod) {
    return null;
  }

  const color = getDeltaLabelColor(data);
  const percentage = `${Math.abs(Math.round(data.changeSincePreviousPeriod * 100)).toPrecision(2)}%`;

  return (
    <S.DeltaLabel
      fontSize="13px"
      color="#62778C"
      fontWeight={600}
      mt={tileSize === 'large' ? undefined : 20}
      pb={tileSize === 'large' ? 7 : undefined}
    >
      <S.Trend inline delta={data.changeSincePreviousPeriod} color={color}>
        <SvgIcon icon="trendUp" size="16" marginRight={4} />
        {percentage}
      </S.Trend>
      <Text> vs {getLabelForPreviousPeriod(data.period)}</Text>
    </S.DeltaLabel>
  );
};

export default DeltaLabel;
