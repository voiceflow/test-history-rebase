import React from 'react';

import { SvgIconContainer } from '@/components/SvgIcon';
import IconButton from '@/componentsV2/IconButton';
import { styled, transition } from '@/hocs';

import ModalBody from './ModalBody';

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
const LeftButton = styled(CarouselButton)`
  left: -60px;
  ${SvgIconContainer} {
    position: relative;
    right: 1px;
  }
`;

const RightButton = styled(CarouselButton)`
  right: -60px;
  ${SvgIconContainer} {
    position: relative;
    left: 1px;
  }
`;

function CarouselButtons({ onLeftClick, onRightClick, disableLeft, disableRight }) {
  return (
    <Container>
      <LeftButton large icon="arrowLeft" size={13} onClick={onLeftClick} disabled={disableLeft} />
      <RightButton large icon="arrowRight" size={13} onClick={onRightClick} disabled={disableRight} />
    </Container>
  );
}

export default CarouselButtons;
