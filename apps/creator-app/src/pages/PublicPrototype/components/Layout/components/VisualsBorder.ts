import { css, styled, transition } from '@/hocs/styled';

interface ContainerProps {
  isActive?: boolean;
  colorScheme?: string;
}

const Container = styled.div<ContainerProps>`
  ${transition('opacity')}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  pointer-events: none;
  border: 5px solid ${({ colorScheme }) => colorScheme ?? '#5d9df5'};
  opacity: 0;

  ${({ isActive }) =>
    isActive &&
    css`
      opacity: 1;
    `}
`;

export default Container;
