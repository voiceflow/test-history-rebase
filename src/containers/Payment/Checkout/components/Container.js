import { styled } from '@/hocs';

const Container = styled.div`
  padding: 10px 0;
  ${({ disabled }) => disabled && 'opacity: 0.5;  pointer-events: none; '}
  overflow: hidden;
`;

export default Container;
