import { IconButton, IconButtonBaseContainerProps, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ModalBody } from '@/components/Modal';
import { styled, transition } from '@/hocs/styled';

export interface ButtonProps extends IconButtonBaseContainerProps {
  large: true;
}

const CarouselButton = styled(IconButton)`
  ${transition()}
  background: white;
  z-index: 2;
  position: absolute;
  top: calc(50% - 20px);

  // if this = none, clicking on the button will close the modal, bad ux
  pointer-events: auto;
  cursor: pointer;
`;

const Container = styled(ModalBody)`
  padding: 0 !important;
  position: initial;
`;

const LeftButton = styled(CarouselButton)<ButtonProps>`
  left: -60px;
  ${SvgIcon.Container} {
    position: relative;
    right: 1px;
  }
`;

const RightButton = styled(CarouselButton)<ButtonProps>`
  right: -60px;

  ${SvgIcon.Container} {
    position: relative;
    left: 1px;
  }
`;

interface CarouselButtonsProps {
  onLeftClick: React.MouseEventHandler<HTMLButtonElement>;
  onRightClick: React.MouseEventHandler<HTMLButtonElement>;
  disableLeft: boolean;
  disableRight: boolean;
}

const CarouselButtons: React.OldFC<CarouselButtonsProps> = ({ onLeftClick, onRightClick, disableLeft, disableRight }) => (
  <Container>
    <LeftButton large icon="arrowLeft" size={13} onClick={onLeftClick} disabled={disableLeft} />
    <RightButton large icon="arrowRight" size={13} onClick={onRightClick} disabled={disableRight} />
  </Container>
);

export default CarouselButtons;
