import { styled } from '@/hocs';

import StepMenuExpandButton from './StepMenuExpandButton';

const TopLevelOuterContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 100%;
  transform: translateX(12px);
  padding: 4px;
  border-radius: 10px;
  background-color: #f4f4f4;
  z-index: 10;

  ${StepMenuExpandButton} {
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    & ${StepMenuExpandButton} {
      height: 16px;
      opacity: 0.3;
      pointer-events: all;
    }
  }
`;

export default TopLevelOuterContainer;
