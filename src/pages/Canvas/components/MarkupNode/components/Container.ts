import { css, styled } from '@/hocs';
import { CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';

export type ContainerProps = {
  isShape: boolean;
};

const Container = styled.div<ContainerProps>`
  position: absolute;

  ${({ isShape }) =>
    isShape &&
    css`
      border: 1px solid transparent;
    `}

  .${CANVAS_MARKUP_CREATING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default Container;
