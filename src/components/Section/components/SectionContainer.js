import { css, styled, transition, units } from '@/hocs';

import { SectionVariant } from '../constants';
import ContentContainer from './ContentContainer';
import HeaderLabel from './HeaderLabel';
import Header from './SectionHeader';
import StatusContainer from './StatusContainer';

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

export const dividersStyles = css`
  &::before {
    position: absolute;
    top: 0;
    left: ${({ isDividerNested, theme }) => (isDividerNested ? theme.unit * 4 : 0)}px;
    right: 0;
    display: block;
    height: 1px;
    background-color: #eaeff4;
    content: '';
  }
`;

const SectionContainer = styled.div`
  position: relative;
  background-color: #fff;
  
  ${({ dividers, isDividerNested, isNested }) =>
    dividers &&
    (isNested || isDividerNested
      ? dividersStyles
      : css`
          :not(:first-child) {
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
    ${({ variant }) => {
      switch (variant) {
        case SectionVariant.tertiary:
          return css`
            color: #62778c;
            font-weight: 600;
            font-size: 15px;
          `;
        case SectionVariant.secondary:
          return css`
            font-weight: ${({ isCollapsed }) => (isCollapsed ? 'normal' : '600')};
            color: #62778c;
          `;
        case SectionVariant.primary:
        default:
          return css`
            font-weight: ${({ isCollapsed }) => (isCollapsed ? 'normal' : '600')};
          `;
      }
    }}
  }

  ${({ variant }) => {
    if (variant === SectionVariant.tertiary) {
      return css`
        ${Header} {
          height: ${units(5)}px;
        }

        ${ContentContainer} {
          padding-bottom: ${units(2)}px;
        }
      `;
    }
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
`;

export default SectionContainer;
