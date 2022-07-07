import { styled } from '@/hocs';

const StepMenuExpandButton = styled.div`
  transition: height 0.2s ease, opacity 0.2s ease;

  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.3;

  &:hover {
    opacity: 0.5;
  }
`;

export default StepMenuExpandButton;
