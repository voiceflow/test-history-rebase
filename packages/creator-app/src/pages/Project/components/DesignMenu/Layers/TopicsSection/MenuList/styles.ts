import { styled } from '@/hocs';

interface ContainerProps {
  isActive?: boolean;
  isDragging?: boolean;
  isDraggingPreview?: boolean;
  isContextMenuOpen?: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  margin-left: 34px;
  margin-right: 12px;
`;
