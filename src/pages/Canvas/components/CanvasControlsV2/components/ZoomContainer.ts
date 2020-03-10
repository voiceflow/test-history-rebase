import Flex from '@/components/Flex';
import { Container } from '@/components/IconButton/components';
import { styled, transition } from '@/hocs';

const ZoomContainer = styled(Flex)`
  position: relative;
  background-color: #fff;
  border-radius: 90px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);

  &:before {
    display: block;
    position: absolute;
    width: 1px;
    height: 20px;
    top: 50%;
    left: 50%;
    bottom: 0;
    content: '';
    background: #dfe3ed;
    transform: translate(-50%, -50%);
    z-index: 2;
    ${transition('opacity')}
  }

  &:active:before {
    opacity: 0;
  }

  & ${Container}:not(:active) {
    box-shadow: none;
  }

  & ${Container}:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & ${Container}:not(:first-of-type) {
    margin-left: 1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export default ZoomContainer;
