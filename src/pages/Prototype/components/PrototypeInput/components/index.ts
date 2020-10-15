import * as React from 'react';

import { FlexCenter } from '@/components/Flex';
import SvgIconContainer from '@/components/SvgIcon/components/SvgIconContainer';
import TextArea from '@/components/TextArea';
import { css, styled, transition } from '@/hocs';

// eslint-disable-next-line xss/no-mixed-html
export const InputArea = styled(TextArea)<{ inputRef: ((node: HTMLTextAreaElement) => void) | React.RefObject<HTMLTextAreaElement> }>`
  padding: 24px;
  border-radius: 0;
  border: none;
  box-shadow: none;
  :active,
  :focus {
    outline: none;
    border: none;
    box-shadow: none;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  min-height: 70px;
  border-top: 1px solid #e2e9ec !important;
`;

const activeButtonStyle = css`
  background: #eef4f6;
  ${SvgIconContainer} {
    ${transition('color')};
    color: #7b8895;
  }
`;

export const ControlButton = styled(FlexCenter)<{ active: boolean }>`
  ${transition('background')}
  border-radius: 5px;
  padding: 3px;
  margin-right: 6px;
  height: 34px;
  width: 34px;
  cursor: pointer;
  background: white;
  :hover {
    ${activeButtonStyle}
  }
  ${({ active }) =>
    active &&
    css`
      ${activeButtonStyle}
      ${SvgIconContainer} {
        ${transition('color')};
        color: #132144 !important;
      }
    `}
`;
