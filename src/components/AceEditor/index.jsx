/* eslint-disable simple-import-sort/sort */
import AceEditor from 'react-ace';
import { styled, css } from '@/hocs';

import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/json_custom';
import 'brace/theme/chrome';
import 'brace/theme/monokai';
/* eslint-enable simple-import-sort/sort */

export default styled(AceEditor)`
  ${({ variant }) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (variant) {
      // TODO:: add other variants here (datasource, etc.)
      case 'javascript':
      default:
        return css`
          & {
            box-sizing: border-box;
            outline: none;

            color: #0b1a38;
            background: #fefefe;
            cursor: text;
            resize: none;
            .ace_text-input {
              position: absolute !important;
            }
          }

          /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
          &.oneline :global(.public-DraftEditor-content) {
            min-height: 0;
          }

          /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
          & :global(.public-DraftEditor-content) {
            min-height: 68px;
          }
        `;
    }
  }}
`;
