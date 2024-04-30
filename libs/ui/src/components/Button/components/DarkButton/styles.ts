import { FlexCenter } from '@/components/Flex';
import { styled } from '@/styles';
import { ANIMATION_SPEED } from '@/styles/constants';

export interface DarkButtonContainerProps {
  icon?: string;
  onClick?: React.MouseEventHandler;
}

export interface DarkButtonLabelProps {
  isLoading?: boolean;
}

export const DarkButtonIcon = styled(FlexCenter)`
  height: 18px;
  padding: 1px 0;
  color: #f2f7f7;
  opacity: 0.85;
`;

export const DarkButtonContainer = styled(FlexCenter)<DarkButtonContainerProps>`
  color: #fff;
  padding: 5px 12px;
  border-radius: 6px;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color ${ANIMATION_SPEED}s ease;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
  background-color: #4b5052;

  &:hover {
    background-color: #5d6264;
    ${DarkButtonIcon} {
      opacity: 1;
    }
  }
`;
