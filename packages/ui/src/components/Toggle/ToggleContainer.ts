import { css, styled } from '@ui/styles';

import { Size } from './constants';

const sizeStyles = {
  [Size.SMALL]: css`
    position: relative;
    height: 20px;

    .react-toggle-track {
      width: 39px;
      height: 19px;
    }

    .react-toggle-thumb {
      width: 13px;
      height: 13px;
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 23px;
    }
  `,

  [Size.EXTRA_SMALL]: css`
    .react-toggle-track {
      width: 32px;
      height: 16px;
    }

    .react-toggle-thumb {
      width: 13px;
      height: 13px;
      top: 2px;
      left: 2px;
      transform: translate(-0.5px, -0.5px);
    }

    .react-toggle--checked .react-toggle-thumb {
      left: 18px;
    }
  `,
};

const ToggleContainer = styled.div<{ size: Size }>`
  display: flex;

  ${({ size }) => size !== Size.NORMAL && sizeStyles[size]}
`;

export default ToggleContainer;
