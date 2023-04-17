import React from 'react';

import * as S from './styles';

export interface Props {
  secondary?: boolean;
  children: string;
}

const RIGHT_PART_SIZE = 14;

const Label: React.FC<Props> = ({ secondary, children }) => (
  <S.Container secondary={secondary}>
    <S.LeftPart>{children.substring(0, children.length - RIGHT_PART_SIZE)}</S.LeftPart>
    <S.RightPart>{children.substring(children.length - RIGHT_PART_SIZE, children.length)}</S.RightPart>
  </S.Container>
);

export default Object.assign(Label, {
  Container: S.Container,
});
