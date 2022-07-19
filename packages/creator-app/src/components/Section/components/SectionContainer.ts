import { css, styled, transition, units } from '@/hocs/styled';

import { SectionVariant } from '../constants';
import ContentContainer from './ContentContainer';
import HeaderLabel from './HeaderLabel';
import Header from './SectionHeader';
import StatusContainer from './StatusContainer';

export interface SectionContainerProps {
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
  isRounded?: boolean;
  fullWidth?: boolean;
  backgroundColor?: string;
}

export const draggingStyles = css`
  & > * {
    opacity: 0;
  }
`;

export const draggingPreviewStyles = css`
  margin: 0 ${units(2)}px;
  background: linear-gradient(180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), rgba(25 5, 255, 255, 0.8);
  border-radius: 7px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 ${units()}px ${units(2)}px 0 rgba(17, 49, 96, 0.16);

  &::before {
    display: none;
  }
`;

export const prototypeStyles = css`
  font-size: 13px;
  color: #62778c !important;

  ${Header} {
    height: 50px !important;
  }
`;

export const formStyles = css`
  ${Header} {
    padding-bottom: 12px;
  }

  ${HeaderLabel} {
    font-weight: 600;
    color: #62778c;
  }

  ${ContentContainer} {
    padding-bottom: ${units(3)}px;
  }
`;

export const uploadStyles = css`
  ${Header} {
    height: 52px !important;
  }
`;

const styles: Partial<Record<SectionVariant, any>> = {
  [SectionVariant.PROTOTYPE]: prototypeStyles,
  [SectionVariant.UPLOAD]: uploadStyles,
  [SectionVariant.FORM]: formStyles,
};

export const dividersStyles = css<SectionContainerProps>`
  position: absolute;
  left: ${({ isDividerNested, variant, theme }) => (isDividerNested || variant === SectionVariant.FORM ? theme.unit * 4 : 0)}px;
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
`;

export const beforeDividersStyle = css<SectionContainerProps>`
  &::before {
    ${dividersStyles}
  }
`;

const SectionContainer = styled.div<SectionContainerProps>`
  position: relative;
  background-color: ${({ backgroundColor = '#fff' }) => backgroundColor};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  & & {
    background-color: transparent;
  }

  ${({ dividers, isRounded, forceDividers, isDividerNested, isNested, isDividerBottom }) =>
    dividers &&
    !isRounded &&
    (isNested || isDividerNested || forceDividers
      ? beforeDividersStyle
      : css`
          :not(${isDividerBottom ? ':last-child' : ':first-child'}) {
            ${beforeDividersStyle}
          }
        `)}

  ${({ isDragging }) => isDragging && draggingStyles}

  ${({ isNested }) =>
    isNested &&
    css`
      margin: 0 -${units(4)}px;
    `}

  ${({ isRounded }) =>
    isRounded &&
    css`
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow: 0 0 16px 0 rgba(19, 33, 68, 0.03), 0 0 0 1px rgba(19, 33, 68, 0.06);
      clip-path: inset(-16px -16px 0px -16px);

      ${Header} {
        border-bottom: 0px;
        border-radius: 12px 12px 0px 0px;
      }
    `}

  ${({ isDraggingPreview }) => isDraggingPreview && draggingPreviewStyles}

  ${HeaderLabel}${({ isNested }) => (isNested ? HeaderLabel : '')} {
    ${({ variant, isCollapsed }) => {
      switch (variant) {
        case SectionVariant.TERTIARY:
        case SectionVariant.TERTIARY_TITLE:
        case SectionVariant.SUBSECTION:
        case SectionVariant.QUATERNARY:
          return css`
            color: #62778c;
            font-weight: 600;
            font-size: 15px;
          `;
        case SectionVariant.SECONDARY:
        case SectionVariant.FORM:
          return css`
            font-weight: ${isCollapsed ? 'normal' : '600'};
            color: #62778c;
          `;
        case SectionVariant.DEVICE:
          return css`
            color: #62778c;
            font-size: 13px;
            letter-spacing: 0.34px;
            text-transform: uppercase;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
          `;
        case SectionVariant.UPLOAD:
          return css`
            font-size: 15px;
            color: ${({ theme }) => theme.colors.primary};
            font-weight: ${isCollapsed ? 'normal' : '600'};
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

    if (variant === SectionVariant.TERTIARY_TITLE) {
      return css`
        ${Header} {
          padding-bottom: 12px;
          padding-top: 24px;
        }
      `;
    }

    if (variant === SectionVariant.SUBSECTION) {
      return css`
        ${Header} {
          padding-bottom: 0px;
          margin-bottom: 11px;
        }

        ${ContentContainer} {
          padding-bottom: ${units(2.5)}px;
        }
      `;
    }

    if (variant === SectionVariant.QUATERNARY) {
      if (headerToggle) {
        return css`
          ${Header} {
            padding-bottom: 16px;
            padding-top: 24px;
          }
        `;
      }
      return css`
        ${Header} {
          padding-bottom: 12px;
          padding-top: 24px;
        }
      `;
    }

    if (variant === SectionVariant.DEVICE) {
      return css`
        border-bottom: 1px solid #dfe3ed;
        ${Header} {
          padding-bottom: 19px;
          padding-top: 18px;
        }

        ${ContentContainer} {
          padding: 0;
      `;
    }

    if (variant === SectionVariant.UPLOAD) {
      return css`
        ${Header} {
          padding: 16px 0px;
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


  ${({ variant }) => (variant ? styles[variant] : null)}
`;

export default SectionContainer;
