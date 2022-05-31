import { SvgIconContainer } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const CheckBoxButton = styled.input`
  ${transition('color')}
  position: absolute;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: 0;
  max-width: 20px;

  & ~ ${SvgIconContainer} {
    ${transition('box-shadow')}
  }

  ${SvgIconContainer} {
    display: block;
    box-shadow: none;
    border-radius: 4px;
  }

  &:hover ~ ${SvgIconContainer} {
    color: ${({ color }) => color || '#5d9df5'};
  }
`;

export default CheckBoxButton;
