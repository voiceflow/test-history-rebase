import { transition } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export interface DropdownWrapperProps {
  size?: string;
}

const DropdownWrapper = styled.div<DropdownWrapperProps>`
  display: flex;
  align-items: center;
  width: ${({ size = '100%' }) => size};
  padding: 10px 16px 12px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(212, 217, 230);
  border-radius: 5px;
  border-image: initial;
  box-shadow: rgba(17, 49, 96, 0.06) 0 0 3px;
  cursor: pointer;
  ${transition('box-shadow', 'border')}

  & > span {
    flex: 1;

    & > span {
      color: rgb(141, 162, 181);
    }
  }
`;

export default DropdownWrapper;
