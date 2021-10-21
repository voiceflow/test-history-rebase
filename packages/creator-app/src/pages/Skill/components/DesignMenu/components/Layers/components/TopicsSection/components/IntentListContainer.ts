import { styled } from '@/hocs';

interface IntentListContainerProps {
  isActive?: boolean;
  isDragging?: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
}

export const INTENT_LIST_OFFSET = 8;

const IntentListContainer = styled.div<IntentListContainerProps>`
  position: relative;
  margin: ${INTENT_LIST_OFFSET}px 8px ${INTENT_LIST_OFFSET}px 24px;
  padding-left: 16px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 2px;
    border-radius: 1px;
    background-color: #dfe3ed;
  }
`;

export default IntentListContainer;
