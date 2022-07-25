import { styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

const StepMenuExpandButton = styled.div`
  transition: height 0.2s ease, opacity 0.2s ease;

  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .${ClassName.SVG_ICON} {
    opacity: 0.65;
  }

  &:hover {
    .${ClassName.SVG_ICON} {
      opacity: 0.8;
    }
  }
`;

export default StepMenuExpandButton;
