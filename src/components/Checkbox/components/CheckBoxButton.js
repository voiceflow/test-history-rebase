import { SvgIconContainer } from '@/components/SvgIcon';
import { styled } from '@/hocs';

const CheckBoxButton = styled.input`
  position: absolute;
  cursor: pointer;
  opacity: 0;

  :focus ~ ${SvgIconContainer} {
    display: block;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(17, 49, 96, 0.24), 0px 0px 0px rgba(17, 49, 96, 0.04);
  }
  :hover ~ ${SvgIconContainer} {
    color: #5d9df5;
  }
`;

export default CheckBoxButton;
