import { menuItemStyles } from '@/componentsV2/Menu';
import { styled } from '@/hocs';

const SelectInputOptionWrapperAbsolute = styled.div`
  ${menuItemStyles};

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: none;

  &:hover,
  &:focus {
    background: none;
  }
`;

export default SelectInputOptionWrapperAbsolute;
