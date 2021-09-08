import { rgbaToHex } from '@voiceflow/ui';

import { css, styled } from '@/hocs';
import { Markup } from '@/models';
import { CANVAS_COMMENTING_ENABLED_CLASSNAME, CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';

export interface ContainerProps {
  isText: boolean;
  rotate: number;
  scale: number;
  maxWidth: number | null;
  backgroundColor: Markup.Color | null;
}

const Container = styled.div<ContainerProps>`
  position: absolute;
  transform: ${({ rotate }) => `rotate(${rotate}rad)`};

  ${({ backgroundColor }) =>
    backgroundColor &&
    `
    background-color: ${rgbaToHex(backgroundColor)};
    border-radius: 8px;
  `};

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

  .${CANVAS_COMMENTING_ENABLED_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default Container;
