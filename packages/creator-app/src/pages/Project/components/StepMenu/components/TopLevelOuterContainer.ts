import { styled } from '@/hocs';

import StepMenuExpandButton from './StepMenuExpandButton';

const TopLevelOuterContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 100%;
  transform: translateX(12px);
  padding: 4px;
  border-radius: 10px;
  background-color: rgba(239, 243, 244, 0.8);
  z-index: 10;

  ${StepMenuExpandButton} {
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    & ${StepMenuExpandButton} {
      height: 20px;
      opacity: 1;
      pointer-events: all;
      margin-bottom: -4px;
    }
  }
`;

export default TopLevelOuterContainer;
