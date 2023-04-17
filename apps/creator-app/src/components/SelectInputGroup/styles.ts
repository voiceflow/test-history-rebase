import { InputWrapper, SelectWrapper } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const SelectContainer = styled.div<{ isLeft?: boolean }>`
  ${SelectWrapper} {
    height: 40px;
    margin: ${({ isLeft }) => (isLeft ? '-10px -12px -10px 0' : '-10px 0 -10px -12px')};
    cursor: pointer;
    overflow: hidden;

    input {
      cursor: pointer;
    }
  }
`;

export const InputContainer = styled.div<{ isLeft?: boolean; multiline?: boolean; overflowHidden?: boolean }>`
  width: 100%;
  display: flex;
  ${({ overflowHidden = true }) =>
    overflowHidden &&
    css`
      overflow: hidden;
    `};

  ${InputWrapper} {
    overflow: hidden;

    ${({ isLeft }) =>
      isLeft
        ? css`
            padding-left: 0;
          `
        : css`
            padding-right: 0;
          `};

    ${({ multiline }) =>
      multiline &&
      css`
        align-items: flex-start;
      `};
  }
`;
