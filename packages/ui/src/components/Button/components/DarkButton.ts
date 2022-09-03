import Box from '@ui/components/Box';
import { styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

export const DarkButton = styled(Box.FlexCenter)`
  border-radius: 6px;
  background-color: #4b5052;
  font-weight: 600;
  text-align: center;
  color: #fff;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color ${ANIMATION_SPEED}s ease;

  &:hover {
    background-color: #5d6264;
  }
`;

export default DarkButton;
