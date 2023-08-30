import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

const SettingsButtonContainer = styled(Box.FlexCenter)<{ isActive?: boolean; isSimple?: boolean }>`
  ${transition('color', 'background-color', 'opacity')}

  width: 48px;
  height: 48px;
  background-color: transparent;
  color: #6e849a;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    background-color: ${({ isSimple }) => (isSimple ? 'transparent' : '#eef4f6')};
    opacity: 1;
  }

  ${({ isActive, isSimple }) =>
    isActive &&
    css`
      color: ${isSimple ? '#3d82e2' : '#132144'};
      opacity: 1;
      background-color: ${isSimple ? 'transparent' : '#eef4f6'};
    `}
`;

export default SettingsButtonContainer;
