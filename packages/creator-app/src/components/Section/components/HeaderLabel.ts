import { overflowTextStyles } from '@voiceflow/ui';

import { SectionVariant } from '@/components/Section/constants';
import { css, styled, units } from '@/hocs/styled';

export enum HeaderVariant {
  SECONDARY = 'secondary',
  LINK = 'link',
  ADD = 'add',
}

export interface HeaderLabelProps {
  variant?: HeaderVariant;
  disabled?: boolean;
  hasToggle: boolean;
  truncated?: boolean;
  isCollapsed: boolean;
  sectionVariant: SectionVariant;
}

const HeaderLabel = styled.div<HeaderLabelProps>`
  ${({ hasToggle, isCollapsed, sectionVariant }) =>
    hasToggle &&
    sectionVariant === SectionVariant.TERTIARY &&
    (isCollapsed
      ? css`
          color: #62778c !important;
        `
      : css`
          color: #132144 !important;
        `)}

  ${({ truncated }) =>
    truncated &&
    css`
      ${overflowTextStyles}

      /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
      min-width: 0;
    `}


  margin-right: ${units(2)}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  ${({ variant }) => {
    switch (variant) {
      // used important to override styling added by parent container with Collapse
      case HeaderVariant.SECONDARY:
        return css`
          color: #62778c !important;
        `;
      case HeaderVariant.LINK:
        return css`
          font-weight: normal !important;
        `;
      case HeaderVariant.ADD:
        return css`
          font-size: 13px;
          font-weight: normal !important;
          text-transform: uppercase;
          color: #62778c !important;
        `;
      default:
        return css`
          font-weight: 500;
        `;
    }
  }}
`;

export default HeaderLabel;
