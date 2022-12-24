import { Flex, FlexCenter, SvgIcon } from '@voiceflow/ui';
import * as React from 'react';

import TextArea from '@/components/TextArea';
import { css, styled, transition } from '@/hocs/styled';

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

export const ControlsContainer = styled(Flex)`
  padding: 10px 24px;
  background: ${({ theme }) => theme.backgrounds.white};
  border-top: 1px solid #e2e9ec !important;
`;

export const InputContainer = styled.div`
  position: relative;
  min-height: 70px;
  border-top: 1px solid #e2e9ec !important;
  background: ${({ theme }) => theme.backgrounds.white};
`;

const activeButtonStyle = css`
  background: #eef4f6;

  ${SvgIcon.Container} {
    ${transition('color')}

    color: #7b8895;
  }
`;

export const ControlButton = styled(FlexCenter)<{ active: boolean; disabled?: boolean }>`
  ${transition('background')}

  border-radius: 5px;
  padding: 3px;
  margin-right: 6px;
  height: 34px;
  width: 34px;
  cursor: pointer;
  background: white;

  ${({ active }) =>
    active &&
    css`
      ${activeButtonStyle}

      ${SvgIcon.Container} {
        ${transition('color')}

        color: #132144 !important;
      }
    `}

  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;

          ${SvgIcon.Container} {
            ${transition('color')}

            color: #becedc !important;
          }
        `
      : css`
          :hover {
            ${activeButtonStyle}
          }

          :active {
            ${activeButtonStyle}

            ${SvgIcon.Container} {
              ${transition('color')}

              color: #132144 !important;
            }
          }
        `}
`;

export const ButtonGroupSplitter = styled.div`
  width: 1px;
  height: 16px;
  background: #dfe3ed;
  margin-right: 10px;
  margin-left: 4px;
`;
