import { FlexApart } from '@voiceflow/ui';
import AceEditor from 'react-ace';

import { css, styled, transition } from '@/hocs';

export const Header = styled(FlexApart)`
  background-color: #0d2e4e;
  padding: 12px 24px;
`;

export const SampleAceEditor = styled(AceEditor).attrs({ theme: 'cobalt', readOnly: true })`
  && {
    background-color: #0d2e4e;

    .ace_gutter {
      background-color: #0d2e4e;
    }
    .ace_string {
      color: #ffa956;
    }
    .ace_escape {
      color: #00d4ff;
    }
    .ace_operator {
      color: #8095ff;
    }
    .ace_comment {
      font-style: normal;
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const Option = styled.div<{ active: boolean }>`
  color: #fff;
  display: inline-block;
  border-radius: 16px;
  padding: 6px 16px;
  cursor: pointer;
  font-weight: 600;

  :hover {
    opacity: 0.8;
  }

  ${transition('color', 'background-color', 'opacity')};

  ${({ active }) =>
    active &&
    css`
      background-color: rgba(93, 157, 245, 0.16);
      color: #5d9df5;
      cursor: default;
      opacity: 1 !important;
    `}
`;
