import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Container = styled(Box.Flex)`
  height: 42px;
  border-radius: 6px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px #d4d9e6;
  max-width: 100%;
`;

export const InputContainer = styled.div<{ active: boolean }>`
  ${transition('border-color')}
  padding: 8px 16px;
  height: 42px;
  border: 1px solid transparent;
  border-radius: 6px;
  width: 181px;
  margin-left: -1px;
  position: relative;
  border-color: ${({ active, theme }) => (active ? theme.colors.blue : 'transparent')};

  input {
    height: 40px;
    border: 1px solid red;
    min-height: 0;
    text-overflow: ellipsis;
    width: 100%;
  }

  ${({ active }) =>
    !active
      ? css`
          &:first-child::after {
            content: '';
            border-right: 1px solid #eaeff4;
            height: 24px;
            position: absolute;
            right: -1px;
            top: 9px;
          }

          &:last-child::before {
            content: '';
            border-left: 1px solid #eaeff4;
            height: 24px;
            position: absolute;
            left: -1px;
            top: 9px;
          }
        `
      : css`
          z-index: 10;
        `}
`;
