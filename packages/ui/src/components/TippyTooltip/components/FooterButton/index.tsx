import React from 'react';

import Multiline from '../Multiline';
import Title from '../Title';
import * as S from './styles';

export interface ComplexProps {
  title?: React.ReactNode;
  width?: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  buttonText: string;
}

const FooterButton: React.FC<ComplexProps> = ({ onClick, buttonText, title, width = 200, children }) => (
  <S.Content>
    {(!!title || !!children) && (
      <Multiline width={width}>
        {!!title && <Title>{title}</Title>}

        {children}
      </Multiline>
    )}

    <S.Button onClick={onClick}>{buttonText}</S.Button>
  </S.Content>
);

export default FooterButton;
