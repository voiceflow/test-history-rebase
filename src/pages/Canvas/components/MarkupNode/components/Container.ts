import { css, styled } from '@/hocs';
import { CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';

export type ContainerProps = {
  isText: boolean;
  rotate: number;
  scale: number;
  maxWidth: number | null;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  transform: ${({ rotate }) => `rotate(${rotate}rad)`};

  ${({ isText, scale, maxWidth, rotate }) =>
    isText &&
    css`
      transform: rotate(${rotate}rad) scale(${scale});

      ${maxWidth === null
        ? css`
            min-width: 330px;
          `
        : css`
            width: ${maxWidth}px;
          `}
    `}

  .${CANVAS_MARKUP_CREATING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default Container;
