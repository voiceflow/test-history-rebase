import 'brace';
import 'brace/theme/cobalt';
import 'brace/mode/html';

import AceEditor from 'react-ace';

import { styled } from '@/hocs';

export const HTMLAceEditor = styled(AceEditor).attrs({
  theme: 'cobalt',
  mode: 'html',
})`
  && {
    border-radius: 8px;
    background-color: #2b2f32;

    .ace_gutter {
      background-color: #2b2f32;
    }
  }
`;
