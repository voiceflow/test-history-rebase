import { css, styled, units } from '@/hocs';

import StepImage from './StepImage';

type StepImageContainerProps = {
  aspectRatio?: number | null;
};

const StepImageContainer = styled.div<StepImageContainerProps>`
  ${({ aspectRatio }) =>
    aspectRatio
      ? css`
          width: calc(100% - ${units(3)}px);
          margin: 0 ${units(1.5)}px ${units(1.5)}px ${units(1.5)}px;

          ${StepImage} {
            height: auto;
            padding-top: ${100 / aspectRatio}%;
          }
        `
      : css`
          width: 100%;
          height: 180px;
          padding: 0 ${units(1.5)}px ${units(1.5)}px ${units(1.5)}px;
        `}
`;

export default StepImageContainer;
