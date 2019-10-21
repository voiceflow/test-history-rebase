import { styled } from '@/hocs';

const StepBadge = styled.div`
  font-size: 0.9em;
  margin: ${({ theme }) => theme.unit / 2}px;
  border-radius: ${({ theme }) => theme.unit}px;
  padding: ${({ theme }) => `${theme.unit / 4}px ${theme.unit / 2}px`};
  font-weight: 400;
  background: #5d9df5;
  color: #fff;
`;

export default StepBadge;
