import type * as Realtime from '@voiceflow/realtime-sdk';
import { rgbaToHex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { CANVAS_COMMENTING_ENABLED_CLASSNAME, CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';

export interface ContainerProps {
  isText: boolean;
  maxWidth: number | null;
  backgroundColor: Realtime.Markup.Color | null;
}

const Container = styled.div<ContainerProps>`
  position: absolute;

  ${({ backgroundColor }) =>
    backgroundColor &&
    `
    background-color: ${rgbaToHex(backgroundColor)};
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: rgb(0, 0, 0, 0.08) 0px 1px 3px 0px;
  `};

  ${({ isText, maxWidth }) =>
    isText &&
    css`
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
