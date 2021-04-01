import { styled } from '@/hocs';

const RadioGroupContainer = styled.div<{ column?: boolean }>`
  display: flex;
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  flex-wrap: wrap;
`;

export default RadioGroupContainer;
