import React from 'react';

import Multiline from '../Multiline';
import Title from '../Title';
import * as S from './styles';

export interface ComplexProps extends React.PropsWithChildren {
  title?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  buttonText: string;
}

const FooterButton: React.FC<ComplexProps> = ({ title, onClick, buttonText, children }) => (
  <S.Content>
    {(!!title || !!children) && (
      <Multiline>
        {!!title && <Title>{title}</Title>}

        {children}
      </Multiline>
    )}

    <S.Button onClick={onClick}>{buttonText}</S.Button>
  </S.Content>
);

export default FooterButton;
