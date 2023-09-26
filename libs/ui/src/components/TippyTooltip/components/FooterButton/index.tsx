import React from 'react';

import Multiline from '../Multiline';
import Title from '../Title';
import * as S from './styles';

export interface ComplexProps extends React.PropsWithChildren {
  title?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  buttonText: React.ReactNode;
  animateFill?: boolean;
  disabled?: boolean;
}

const FooterButton: React.FC<ComplexProps> = ({ title, onClick, children, buttonText, animateFill, disabled }) => (
  <S.Content $animateFill={animateFill}>
    {(!!title || !!children) && (
      <Multiline>
        {!!title && <Title>{title}</Title>}

        {children}
      </Multiline>
    )}

    <S.Button disabled={disabled} onClick={onClick}>
      {buttonText}
    </S.Button>
  </S.Content>
);

export default FooterButton;
