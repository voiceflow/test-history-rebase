import { styled, transition } from '@/hocs/styled';

const CloseIcon = styled.div`
  width: 4px;
  height: 20px;
  z-index: 25;
  border-radius: 3px;
  position: relative;
  overflow: hidden;

  &:before {
    position: absolute;
    inset: 0;
    opacity: 0.5;
    background: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a), #fff;
    content: '';
  }

  &:after {
    ${transition('opacity')}

    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(61, 130, 226, 0.8), #3d82e2 100%), #fff;

    opacity: 0;
    content: '';
  }
`;

export default CloseIcon;
