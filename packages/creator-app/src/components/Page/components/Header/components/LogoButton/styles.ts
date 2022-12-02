import { css, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

import IconButton from '../IconButton';

export const StyledLogoButton = styled(IconButton).attrs({ icon: 'voiceflowV', size: 26, iconProps: { color: '#000' } })<{ withBorder?: boolean }>`
  ${({ theme, withBorder }) =>
    withBorder &&
    css`
      border-right: 1px solid ${theme.colors.borders};
    `};

  ${IconButton.S.Button} {
    width: ${({ theme }) => theme.components.page.header.height - 1}px;
  }

  ${IconButton.S.ExpandIconContainer} {
    right: 9px;
    bottom: 9px;
  }

  &:hover {
    ${IconButton.S.ExpandIconContainer} {
      opacity: 1;

      .${ClassName.SVG_ICON} {
        transform: translate(2px, 2px);
      }
    }
  }

  &:active ${IconButton.S.ExpandIconContainer} {
    opacity: 1;

    .${ClassName.SVG_ICON} {
      color: #132144;
      transform: translate(2px, 2px);
    }
  }

  ${({ active }) =>
    active
      ? css`
          & ${IconButton.S.ExpandIconContainer} {
            opacity: 1;

            .${ClassName.SVG_ICON} {
              color: #132144;
              transform: translate(2px, 2px);
            }
          }
        `
      : css`
          & ${IconButton.S.Button}:hover:not(:active) {
            background-color: #fbfbfb;
          }
        `}
`;
