import { styled } from '@/hocs';

const StepMenuExpandButton = styled.div<{ expanded?: boolean }>`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  cursor: pointer;
`;

export default StepMenuExpandButton;
