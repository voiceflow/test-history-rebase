import { SvgIconContainer } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const CheckBoxButton = styled.input`
  ${transition('color')}
  position: absolute;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: 0;

  & ~ ${SvgIconContainer} {
    ${transition('box-shadow')}
  }

  &:focus ~ ${SvgIconContainer} {
    display: block;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(17, 49, 96, 0.24), 0 0 0 rgba(17, 49, 96, 0.04);
  }

  &:hover ~ ${SvgIconContainer} {
    color: ${({ color }) => color || '#5d9df5'};
  }
`;

export default CheckBoxButton;
