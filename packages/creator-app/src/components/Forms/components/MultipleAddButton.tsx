import { backgrounds, ButtonContainer, colors } from '@voiceflow/ui';

import { styled } from '@/hocs';

const MultipleAddButton = styled(ButtonContainer)`
  display: block;
  width: 100%;
  color: ${colors('blue')};
  border: 1px solid ${colors('blue')};
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    color: ${colors('white')};
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('blue')};
  }

  &:active {
    color: #132042;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85) 0%, ${backgrounds('greyGreen')} 100%), ${colors('white')};
    background-color: ${colors('white')};
    border: 1px solid ${colors('borders')};
  }
`;

export default MultipleAddButton;
