import { css, styled, transition, units } from '@/hocs';

import { SectionVariant } from '../constants';
import ContentContainer from './ContentContainer';
import HeaderLabel from './HeaderLabel';
import Header from './SectionHeader';
import StatusContainer from './StatusContainer';

export type SectionContainerProps = {
  isLink?: boolean;
  variant?: SectionVariant;
  dividers?: boolean;
  isNested?: boolean;
  isDragging?: boolean;
  isCollapsed?: boolean;
  borderBottom?: boolean;
  forceDividers?: boolean;
  isDividerBottom?: boolean;
  isDividerNested?: boolean;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
  headerToggle?: boolean;
};

export const draggingStyles = css`
  & > * {
    opacity: 0;
  }
`;

export const draggingPreviewStyles = css`
  margin: 0 ${units(2)}px;
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), rgba(255, 255, 255, 0.8);
  border-radius: 7px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 ${units()}px ${units(2)}px 0 rgba(17, 49, 96, 0.16);

  &::before {
    display: none;
  }
`;

export const dividersStyles = css<SectionContainerProps>`
  &::before {
    position: absolute;
    left: ${({ isDividerNested, theme }) => (isDividerNested ? theme.unit * 4 : 0)}px;
    right: 0;
    display: block;
    height: 1px;
    background-color: #eaeff4;
    content: '';

    ${({ isDividerBottom }) =>
      isDividerBottom
        ? css`
            bottom: 0;
          `
        : css`
            top: 0;
          `}
  }
`;

const SectionContainer = styled.div<SectionContainerProps>`
  position: relative;
  background-color: #fff;

  ${({ dividers, forceDividers, isDividerNested, isNested, isDividerBottom }) =>
    dividers &&
    (isNested || isDividerNested || forceDividers
      ? dividersStyles
      : css`
          :not(${isDividerBottom ? ':last-child' : ':first-child'}) {
            ${dividersStyles}
          }
        `)}

  ${({ isDragging }) => isDragging && draggingStyles}

  ${({ isNested }) =>
    isNested &&
    css`
      margin: 0 -${units(4)}px;
    `}

  ${({ isDraggingPreview }) => isDraggingPreview && draggingPreviewStyles}

  ${HeaderLabel} {
    ${({ variant, isCollapsed }) => {
      switch (variant) {
        case SectionVariant.TERTIARY:
        case SectionVariant.SUBSECTION:
          return css`
            color: #62778c;
            font-weight: 600;
            font-size: 15px;
          `;
        case SectionVariant.SECONDARY:
          return css`
            font-weight: ${isCollapsed ? 'normal' : '600'};
            color: #62778c;
          `;
        case SectionVariant.QUATERNARY:
          return css`
            color: #62778c;
            font-weight: 600;
            font-size: 15px;
          `;
        case SectionVariant.PRIMARY:
        default:
          return css`
            font-weight: ${isCollapsed ? 'normal' : '600'};
          `;
      }
    }}
  }

  ${({ variant, headerToggle }) => {
    if (variant === SectionVariant.TERTIARY) {
      return css`
        ${Header} {
          height: ${units(5)}px;
        }
        ${ContentContainer} {
          padding-bottom: ${units(2)}px;
        }
      `;
    }

    if (variant === SectionVariant.SUBSECTION) {
      return css`
        ${Header} {
          padding-bottom: 11px;
        }
      `;
    }

    if (variant === SectionVariant.QUATERNARY) {
      if (headerToggle) {
        return css`
          ${Header} {
            padding-bottom: 16px;
            padding-top: 25px;
          }
        `;
      }
      return css`
        ${Header} {
          padding-bottom: 10px;
          padding-top: 25px;
        }
      `;
    }

    return '';
  }}

  ${({ isLink }) =>
    isLink &&
    css`
      ${StatusContainer} {
        color: #becedc !important;
        ${transition('transform')}
      }

      &:hover {
        ${StatusContainer} {
          transform: translateX(5px) !important;
        }
      }
    `}

  ${({ isContextMenuOpen }) =>
    isContextMenuOpen &&
    css`
      background-image: linear-gradient(-180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%);
    `}

  ${({ borderBottom }) =>
    borderBottom &&
    css`
      border-bottom: 1px solid #eaeff4;
    `}
`;

export default SectionContainer;
