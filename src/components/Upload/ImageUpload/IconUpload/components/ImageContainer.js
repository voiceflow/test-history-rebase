import { css } from 'styled-components';

import { FlexCenter } from '@/components/Flex';
import { styled, transition } from '@/hocs';

const ImageContainer = styled(FlexCenter)`
  ${transition('background-color, border')}
  border-radius: 50%;
  border: 1px solid #d4d9e6;
  cursor: pointer;
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background-color: rgba(212, 217, 230, 0.24);
  background-position: center center;
  background-size: cover;
  background-image: ${({ image }) => image && `url(${image})`};

  &:hover {
    background-color: rgba(212, 217, 230, 0.44);
  }

  &:before {
    background: none;
    border: 3px solid #fff;
    border-radius: 50%;
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      background-color: white;
      :hover {
        background-color: white;
      }
    `}

  ${({ error, notAccepted }) =>
    (error || notAccepted) &&
    css`
      background-color: rgba(233, 30, 99, 0.1);
      border: 1px solid red;
    `}
`;

export default ImageContainer;
