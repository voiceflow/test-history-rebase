import Flex from '@/componentsV2/Flex';
import { Container } from '@/componentsV2/IconButton/components';
import { styled } from '@/hocs';

const CanvasControlsZoom = styled(Flex)`
  position: relative;

  &:before {
    display: block;
    position: absolute;
    width: 1px;
    margin-left: -1px;
    top: 0;
    left: 50%;
    bottom: 0;
    content: '';
    background: linear-gradient(#f2f3f6, #d4dae1);
    z-index: 2;
  }

  border-radius: 90px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

  & ${Container}:not(:active) {
    box-shadow: none;
  }

  & ${Container}:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & ${Container}:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export default CanvasControlsZoom;
