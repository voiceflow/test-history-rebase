import Flex from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

type IconContainerProps = {
  isListening: boolean;
};

const IconContainer = styled(Flex)<IconContainerProps>`
  position: absolute;
  top: 50%;
  left: 20px;
  padding: 5px 10px;
  background-color: transparent;
  color: inherit;
  transform: translateY(-50%);
  ${transition('transform', 'color')}

  ${({ isListening }) =>
    isListening &&
    css`
      color: #fff;

      &:before {
        position: absolute;
        top: 2px;
        right: 10px;
        width: 8px;
        height: 8px;
        background-image: linear-gradient(-180deg, rgba(233, 30, 99, 0.85), #e91e63);
        border: 1px solid #263353;
        border-radius: 10px;
        animation: flickerAnimation 1.5s infinite;
        content: '';
      }
    `}
`;

export default IconContainer;
