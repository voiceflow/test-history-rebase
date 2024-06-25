import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip from '@ui/components/TippyTooltip';
import React from 'react';

import * as S from './styles';
import type * as T from './types';

const Column: React.FC<T.Props> = ({ flex, active, width, onClick, tooltip, sortable, children, descending }) => {
  const nubUpColor = active && !descending ? '#132144' : '#becedc';
  const nubDownColor = active && descending ? '#132144' : '#becedc';

  return (
    <S.Container sortable={sortable} active={active} flex={flex} width={width} onClick={onClick}>
      {tooltip ? <TippyTooltip {...tooltip}>{children}</TippyTooltip> : children}

      {sortable && (
        <S.SortContainer visible={active}>
          <SvgIcon icon="nubUp" color={nubUpColor} size={6} style={{ position: 'relative', top: '0px' }} />
          <SvgIcon icon="nubDown" size={6} color={nubDownColor} />
        </S.SortContainer>
      )}
    </S.Container>
  );
};

export default Column;
