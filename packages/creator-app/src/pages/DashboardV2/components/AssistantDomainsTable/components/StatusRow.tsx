import { Utils } from '@voiceflow/common';
import { Dropdown } from '@voiceflow/ui';
import React from 'react';

import type { Domain } from '../types';
import * as S from './styles';

export const StatusRow: React.FC<{ item: Domain }> = ({ item }) => {
  const status = React.useMemo(() => Utils.string.capitalizeFirstLetter((item.status || '').toLowerCase()), []);
  const options = React.useMemo(
    () => [
      { label: 'Design', onClick: () => {} },
      { label: 'In Review', onClick: () => {} },
      { label: 'Complete', onClick: () => {} },
    ],
    []
  );
  return (
    <Dropdown placement="bottom" selfDismiss options={options}>
      {(ref, onToggle) => (
        <S.StatusRow ref={ref} onClick={onToggle}>
          {status} <S.StyledSVG icon="arrowRightTopics" size={9} />
        </S.StatusRow>
      )}
    </Dropdown>
  );
};
