import { DraftJSEditorContainer } from '@/components/DraftJSEditor';
import { styled, transition } from '@/hocs';
import { NODE_FOCUSED_CLASSNAME } from '@/pages/Canvas/constants';

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

  &:hover ${DraftJSEditorContainer} {
    border: solid 1px #5d9df5;
  }

  .${NODE_FOCUSED_CLASSNAME} & ${DraftJSEditorContainer} {
    border: solid 1px rgba(98, 119, 140, 0.5);

    pointer-events: auto;
  }

  .${NODE_FOCUSED_CLASSNAME} & ${DraftJSEditorContainer}:focus-within {
    border: solid 1px transparent;
  }
`;

export default Container;
