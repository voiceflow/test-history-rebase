import { CANVAS_SHIFT_PRESSED_CLASSNAME } from '@/components/Canvas/constants';
import { css, styled } from '@/hocs/styled';
import { CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';
import { Identifier } from '@/styles/constants';

interface ContainerProps {
  url: string;
  width: number;
  height: number;
  activated: boolean;
}

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

  &:hover {
    cursor: grab;
  }

  #${Identifier.CANVAS_CONTAINER}:not(.${CANVAS_DRAGGING_CLASSNAME}) &:hover {
    border: solid 1px #5d9df5;
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
