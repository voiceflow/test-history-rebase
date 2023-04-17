import { Menu } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const SelectInputOptionWrapperAbsolute = styled.div`
  ${Menu.itemStyles};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: none;

  &:hover,
  &:focus {
    background: none;
  }
`;

export default SelectInputOptionWrapperAbsolute;
