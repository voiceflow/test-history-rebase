import { CANVAS_SHIFT_PRESSED_CLASSNAME } from '@/components/Canvas/constants';
import { PlaceholderText } from '@/components/SlateEditable/components/Placeholder';
import { BlockType } from '@/constants';
import { css, styled } from '@/hocs/styled';
import { CANVAS_DRAGGING_CLASSNAME, CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';
import { Identifier } from '@/styles/constants';

import { SLATE_EDITOR_CLASS_NAME } from '../../constants';
import Border from './Border';

export const Container = styled.div<{ editable?: boolean; activated?: boolean; isNew?: boolean; focused?: boolean }>`
  position: relative;
  min-height: 30px;
  overflow: hidden;

  /* default text editor styles */
  color: #132144;
  font-size: 20px;
  font-family: Open Sans;
  font-weight: 400;

  &:hover {
    cursor: grab;
  }

  .${SLATE_EDITOR_CLASS_NAME} {
    border: solid 10px transparent;
    pointer-events: none;
  }

  .${CANVAS_SHIFT_PRESSED_CLASSNAME} &:hover {
    cursor: pointer;
  }

  #${Identifier.CANVAS_CONTAINER}:not(.${CANVAS_DRAGGING_CLASSNAME}) &:not(:focus-within):hover ${Border} {
    color: #5d9df5;
  }

  .${CANVAS_MARKUP_CREATING_CLASSNAME}[data-markup-creating-type="${BlockType.MARKUP_TEXT}"] & {
    &:hover ${Border} {
      color: #5d9df5;
    }

    .${SLATE_EDITOR_CLASS_NAME} {
      pointer-events: auto;
      cursor: text;
    }
  }

  ${({ activated }) =>
    activated &&
    css`
      & ${Border} {
        color: #5d9df5;
      }
    `}

  ${({ editable }) =>
    editable &&
    css`
      & ${Border} {
        color: #5d9df5;
      }

      & .${SLATE_EDITOR_CLASS_NAME} {
        cursor: text;
        pointer-events: auto;
      }
    `}

  .${CANVAS_DRAGGING_CLASSNAME} & {
    ${({ activated, focused }) =>
      activated &&
      focused &&
      css`
        ${Border} {
          color: transparent !important;
        }
      `}
  }

  & [contenteditable] {
    -webkit-user-select: text;
  }

  [data-slate-node='element'] {
    ${({ isNew }) =>
      isNew &&
      css`
        width: fit-content;
        min-width: 1px;
        margin: 0 auto;

        & [data-slate-node='text'] {
          white-space: pre;
        }
      `}
  }

  ${PlaceholderText} {
    margin-top: 3px;
    color: #132144 !important;
    opacity: 0.333 !important;
    font-size: 20px;

    ${({ isNew }) =>
      isNew &&
      css`
        width: 150px !important;
        max-width: 150px !important;
        transform: translate(-50%, -10%);
      `}
  }
`;

export default Container;
