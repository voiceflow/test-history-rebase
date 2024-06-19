import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const StepItemContainer = styled(Box.Flex)<{ nested?: boolean; nestedWithIcon?: boolean; noDivider?: boolean }>`
  position: relative;
  ${({ noDivider }) =>
    noDivider &&
    css`
      min-height: 24px;
      :last-of-type {
        padding-bottom: 16px;
      }
    `};

  ${({ nested, nestedWithIcon, noDivider }) => {
    if (nestedWithIcon)
      return noDivider
        ? css`
            padding: 0px 16px 0px 55px;
          `
        : css`
            min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
            padding: 16px 16px 16px 55px;
          `;

    if (noDivider) {
      return css`
        padding: 16px 16px 0px 22px;
      `;
    }

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
