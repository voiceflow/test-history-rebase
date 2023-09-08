import SvgIcon from '@ui/components/SvgIcon';
import { styled, transition } from '@ui/styles';
import { fontResetStyle } from '@ui/styles/bootstrap';

const Button = styled.input`
  ${fontResetStyle};

  ${transition('color')}

  position: absolute;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: 0;
  max-width: 20px;

  & ~ ${SvgIcon.Container} {
    ${transition('box-shadow')}
  }

  ${SvgIcon.Container} {
    display: block;
    box-shadow: none;
    border-radius: 4px;
  }

  &:hover ~ ${SvgIcon.Container} {
    color: ${({ color }) => color || '#5d9df5'};
  }
`;

export default Button;
