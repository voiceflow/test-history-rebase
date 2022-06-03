import { styled, units } from '@/hocs';
import StepItemContainer from '@/pages/Canvas/components/Step/components/StepItemContainer';

export const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 ${units(2)}px;
  border: 1px solid #dfe3ed;
  line-height: 1;
  border-radius: 6px;
  width: 100%;
  color: #132144;
  font-weight: 600;
`;

export const ButtonGroup = styled.div`
  width: 100%;

  ${Button} {
    max-width: calc(100% - 24px);
  }

  > :not(:first-of-type) ${Button} {
    margin-top: -1px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-top-color: #eaeff4;
  }

  > :not(:last-of-type) ${Button} {
    border-bottom-color: #eaeff4;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
`;

export const NoMatchNoReplySection = styled.div`
  width: 100%;

  ${StepItemContainer}::before {
    position: absolute;
    top: -1px;
    height: 1px;
    left: ${units(3)}px;
    right: 0;
    content: '';
    border-top: 1px solid #eaeff4;
  }
`;
