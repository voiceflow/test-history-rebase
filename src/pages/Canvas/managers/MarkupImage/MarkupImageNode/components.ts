import { CANVAS_SHIFT_PRESSED_CLASSNAME } from '@/components/Canvas/constants';
import { css, styled } from '@/hocs';
import { CANVAS_DRAGGING_CLASSNAME, CANVAS_MARKUP_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';

type ContainerProps = {
  url: string;
  width: number;
  height: number;
  activated: boolean;
};

export const Container = styled.div.attrs<ContainerProps>(({ width, height }) => ({
  style: {
    width: `${width}px`,
    height: `${height}px`,
  },
}))<ContainerProps>`
  background-size: 100% 100%;
  background-position: center;
  background-image: ${({ url }) => `url(${url})`};
  z-index: -1;
  border: solid 1px transparent;
  background-repeat: no-repeat;

  .${CANVAS_MARKUP_ENABLED_CLASSNAME}:not(.${CANVAS_DRAGGING_CLASSNAME}) &:hover {
    border: solid 1px #5d9df5;
  }

  .${CANVAS_MARKUP_ENABLED_CLASSNAME} &:hover {
    cursor: grab;
  }

  .${CANVAS_SHIFT_PRESSED_CLASSNAME} &:hover {
    cursor: pointer;
  }

  ${({ activated }) =>
    activated &&
    css`
      border: solid 1px #5d9df5;
    `}
`;

export default Container;
