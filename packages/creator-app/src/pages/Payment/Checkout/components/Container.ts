import { styled } from '@/hocs/styled';

interface ContainerProps {
  disabled: boolean;
  invalid: boolean;
}

const Container = styled.div<ContainerProps>`
  padding: 10px 0;
  ${({ disabled }) => disabled && 'opacity: 0.5;  pointer-events: none; '}
  overflow: hidden;

  pointer-events: ${({ invalid }) => invalid && 'none'};
`;

export default Container;
