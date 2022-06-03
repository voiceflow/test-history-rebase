import { css, styled } from '@ui/styles';
import { ANIMATION_SPEED } from '@ui/styles/constants';

export const ButtonContainer = styled.div<{ isVisible: boolean }>`
  opacity: 0;
  padding: 10px 0px;
  border-radius: 6px;
  background-color: #4b5052;
  position: absolute;
  bottom: 6px;
  font-weight: 600;
  width: calc(100% - 10px);
  text-align: center;
  left: 5px;
  color: white;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color ${ANIMATION_SPEED}s ease;
  &:hover {
    background-color: #5d6264;
  }
  transition: opacity 0.15s ease;
  transition-delay: 150ms;

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
    `}
`;
