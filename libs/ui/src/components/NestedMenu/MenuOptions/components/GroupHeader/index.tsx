import React from 'react';

import * as S from './styles';

interface GroupHeaderProps extends React.PropsWithChildren {
  isSmall?: boolean;
}

/**
 * If childer === true we display Line only
 */
const GroupHeader: React.FC<GroupHeaderProps> = ({ isSmall, children }) => (
  <>
    {!children ? (
      <S.Line />
    ) : (
      <S.Container isSmall={isSmall}>
        <S.Title>{children}</S.Title>
        <S.Line />
      </S.Container>
    )}
  </>
);

export default GroupHeader;
