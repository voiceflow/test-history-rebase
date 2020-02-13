import * as SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';

const CheckBoxButton = styled.input`
  ${transition()}
  position: absolute;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: 0;

  :focus ~ ${SvgIcon.Container} {
    display: block;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(17, 49, 96, 0.24), 0px 0px 0px rgba(17, 49, 96, 0.04);
  }

  :hover ~ ${SvgIcon.Container} {
    color: ${({ color }) => color || '#5d9df5'};
  }
`;

export default CheckBoxButton;
