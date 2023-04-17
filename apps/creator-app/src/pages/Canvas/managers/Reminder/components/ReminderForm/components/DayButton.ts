import { ButtonContainer } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const DayButton = styled(ButtonContainer)<{ selected?: boolean }>`
  width: 40px;
  height: 40px;

  ${({ selected }) =>
    selected
      ? css`
          color: #ffffff;
          background: #5d9df5 !important;
        `
      : css`
          color: #62778c;
        `}

  &:hover {
    background: #eef4f6 !important;
  }
`;

export default DayButton;
