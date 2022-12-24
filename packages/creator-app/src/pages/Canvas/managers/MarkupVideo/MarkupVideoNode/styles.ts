import { CANVAS_SHIFT_PRESSED_CLASSNAME } from '@/components/Canvas/constants';
import { css, styled } from '@/hocs/styled';
import { CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';
import { Identifier } from '@/styles/constants';

interface ContainerProps {
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
  z-index: -1;
  border-radius: 8px;
  position: relative;
  border: solid 1px transparent;

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

export const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  box-shadow: rgba(17, 49, 96, 0.12) 0px 2px 6px 0px;
`;
