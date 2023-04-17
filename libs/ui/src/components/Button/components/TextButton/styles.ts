import { styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

export const TextButtonContainer = styled.button`
  padding: 0;
  border: 0;
  color: #3d82e2;
  cursor: pointer;
  transition: color ${ANIMATION_SPEED}s ease;
  background-color: transparent;

  &:hover {
    color: #3876cb;
  }
`;
