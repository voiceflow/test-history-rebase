import { Flex } from '@voiceflow/ui';

import { TextInputContainer } from '@/components/ButtonDropdownInput/components';
import { css, styled } from '@/hocs';

import DropdownButton from './DropdownButton';
import Input from './Input';

const DropdownContainer = styled(Flex)<{ isInvalid: boolean }>`
  position: relative;
  flex-wrap: nowrap;
  flex: 1;

  & ${Input}, ${DropdownButton}, ${TextInputContainer} {
    transition: border-color 0.15s ease;
    border-color: #d2dae2 !important;

    ${({ isInvalid }) =>
      isInvalid &&
      css`
        border-color: #e91e63 !important;
      `}
  }

  :focus-within {
    & ${Input}, ${DropdownButton} {
      border-color: #5d9df5 !important;

      ${({ isInvalid }) =>
        isInvalid &&
        css`
          border-color: #e91e63 !important;
        `}
    }
  }
`;

export default DropdownContainer;
