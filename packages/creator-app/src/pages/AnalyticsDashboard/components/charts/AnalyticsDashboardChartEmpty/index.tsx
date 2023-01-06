import { Text } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

const AnalyticsDashboardChartEmpty: React.OldFC = () => {
  return (
    <S.Container>
      <Text fontSize="15px" color="#62778C">
        Report is empty because no data matches filters.
      </Text>
    </S.Container>
  );
};

export default AnalyticsDashboardChartEmpty;
