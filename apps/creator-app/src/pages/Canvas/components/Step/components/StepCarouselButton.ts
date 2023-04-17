import { styled, units } from '@/hocs/styled';

export const StepCarouselButton = styled.div`
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

export const StepCarouselButtonGroup = styled.div`
  width: 100%;

  ${StepCarouselButton} {
    max-width: calc(100% - 24px);
  }

  > :not(:first-of-type) ${StepCarouselButton} {
    margin-top: -1px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-top-color: #eaeff4;
  }

  > :not(:last-of-type) ${StepCarouselButton} {
    border-bottom-color: #eaeff4;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
`;
