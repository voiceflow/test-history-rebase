import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const StepItemContainer = styled(Box.Flex)<{ nested?: boolean; nestedWithIcon?: boolean }>`
  position: relative;
  ${({ nested, nestedWithIcon }) => {
    if (nestedWithIcon)
      return css`
        min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
        padding: 16px 16px 16px 55px;
      `;

    return nested
      ? css`
          :before {
            display: none;
          }
          padding: 0 16px 0 22px;
        `
      : css`
          min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
          padding: 16px 16px 16px 22px;
        `;
  }}

  width: 100%;
`;

export default StepItemContainer;
