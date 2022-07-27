import { css, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

import IconButton from '../../IconButton';
import IconButtonButton from '../../IconButton/components/Button';
import ExpandIconContainer from '../../IconButton/components/ExpandIconContainer';

const StyledLogoButton = styled(IconButton).attrs({ icon: 'voiceflowV', size: 26, iconProps: { color: '#000' } })`
  border-right: 1px solid ${({ theme }) => theme.colors.borders};

  ${IconButtonButton} {
    width: ${({ theme }) => theme.components.projectPage.header.height - 1}px;
  }

  ${ExpandIconContainer} {
    right: 9px;
    bottom: 9px;
  }

  &:hover {
    ${ExpandIconContainer} {
      opacity: 1;

      .${ClassName.SVG_ICON} {
        transform: translate(2px, 2px);
      }
    }
  }

  &:active ${ExpandIconContainer} {
    opacity: 1;

    .${ClassName.SVG_ICON} {
      color: #132144;
      transform: translate(2px, 2px);
    }
  }

  ${({ active }) =>
    active
      ? css`
          & ${ExpandIconContainer} {
            opacity: 1;

            .${ClassName.SVG_ICON} {
              color: #132144;
              transform: translate(2px, 2px);
            }
          }
        `
      : css`
          & ${IconButtonButton}:hover:not(:active) {
            background-color: #fbfbfb;
          }
        `}
`;

export default StyledLogoButton;
