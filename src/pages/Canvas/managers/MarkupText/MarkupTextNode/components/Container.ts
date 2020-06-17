import { DraftJSEditorContainer } from '@/components/DraftJSEditor';
import { styled, transition } from '@/hocs';
import {
  CANVAS_DRAGGING_CLASSNAME,
  CANVAS_MARKUP_ENABLED_CLASSNAME,
  CANVAS_MARKUP_TRANSFORMING_CLASSNAME,
  NODE_FOCUSED_CLASSNAME,
} from '@/pages/Canvas/constants';

export const Container = styled.div`
  ${transition('border-color')}

  min-width: 160px;
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

  .${CANVAS_MARKUP_ENABLED_CLASSNAME}:not(.${CANVAS_DRAGGING_CLASSNAME}):not(.${CANVAS_MARKUP_TRANSFORMING_CLASSNAME}) &:not(:focus-within):hover ${DraftJSEditorContainer} {
    border: solid 1px #5d9df5;
  }

  .${NODE_FOCUSED_CLASSNAME} & ${DraftJSEditorContainer} {
    border: solid 1px transparent !important;

    pointer-events: auto;
  }
`;

export default Container;
