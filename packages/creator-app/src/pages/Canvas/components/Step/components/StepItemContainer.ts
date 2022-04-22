import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const StepItemContainer = styled(Flex)<{ nested?: boolean }>`
  position: relative;
  ${({ nested }) =>
    nested
      ? css`
          :before {
            display: none;
          }
          padding: 0 16px 0 22px;
        `
      : css`
          min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
          padding: 16px 16px 16px 22px;
        `}
  width: 100%;
`;

export default StepItemContainer;
