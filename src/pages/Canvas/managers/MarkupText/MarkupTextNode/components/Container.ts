import { DraftJSEditorContainer } from '@/components/DraftJSEditor';
import { css, styled } from '@/hocs';
import { CANVAS_DRAGGING_CLASSNAME, CANVAS_MARKUP_ENABLED_CLASSNAME, NODE_FOCUSED_CLASSNAME } from '@/pages/Canvas/constants';

export const Container = styled.div<{ activated: boolean }>`
  border: solid 1px transparent;

  min-height: 30px;

  /* default text editor styles */
  color: #132144;
  font-size: 20px;
  font-family: Open Sans;
  font-weight: 400;

  ${DraftJSEditorContainer} {
    border: solid 1px transparent;
    pointer-events: none;
  }

  .${CANVAS_MARKUP_ENABLED_CLASSNAME}:not(.${CANVAS_DRAGGING_CLASSNAME}) &:not(:focus-within):hover  {
    border: solid 1px #5d9df5;
  }

   ${({ activated }) =>
     activated &&
     css`
       border: solid 1px #5d9df5;
     `}

  .${NODE_FOCUSED_CLASSNAME} & ${DraftJSEditorContainer} {
    border: solid 1px transparent !important;

    pointer-events: auto;
  }
`;

export default Container;
