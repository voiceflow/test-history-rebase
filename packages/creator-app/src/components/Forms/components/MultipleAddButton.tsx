import { backgrounds, ButtonContainer, colors, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MultipleAddButton = styled(ButtonContainer)`
  display: block;
  width: 100%;
  color: ${colors(ThemeColor.BLUE)};
  border: 1px solid ${colors(ThemeColor.BLUE)};
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: ${colors(ThemeColor.WHITE)};
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors(ThemeColor.BLUE)};
  }

  &:active {
    color: #132042;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors(ThemeColor.WHITE)};
    background-color: ${colors(ThemeColor.WHITE)};
    border: 1px solid ${colors(ThemeColor.BORDERS)};
  }
`;

export default MultipleAddButton;
