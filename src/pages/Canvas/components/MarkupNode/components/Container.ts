import { css, styled } from '@/hocs';
import { CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';

export type ContainerProps = {
  isShape: boolean;
  isText: boolean;
  rotate: number;
  scale: number;
  maxWidth: number | null;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  transform: ${({ rotate }) => `rotate(${rotate}rad)`};

  ${({ isShape }) =>
    isShape &&
    css`
      border: 1px solid transparent;
    `}

  ${({ isText, scale, maxWidth }) =>
    isText &&
    css`
      transform: scale(${scale});

      ${maxWidth !== null &&
      css`
        width: ${maxWidth}px;
      `}
    `}

  .${CANVAS_MARKUP_CREATING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default Container;
