import { useOnScreen } from '@ui/hooks';
import React from 'react';

import Multiline from '../Multiline';
import Title from '../Title';
import { ButtonContainer } from './components';

export interface ComplexProps {
  title?: React.ReactNode;
  width?: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  buttonText: string;
  defaultVisible?: boolean;
}

const FooterButton: React.FC<ComplexProps> = ({ onClick, buttonText, title, width = 200, children, defaultVisible }) => {
  const buttonRef = React.useRef(null);
  const isVisible = useOnScreen(buttonRef, { initialState: defaultVisible });

  return (
    <Multiline width={width} style={{ paddingBottom: '48px' }}>
      {!!title && <Title>{title}</Title>}

      {children}
      <ButtonContainer isVisible={isVisible} ref={buttonRef} onClick={onClick}>
        {buttonText}
      </ButtonContainer>
    </Multiline>
  );
};

export default FooterButton;
