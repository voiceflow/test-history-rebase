import { SectionVariant } from '@/components/Section';
import { overflowTextStyles } from '@/components/Text';
import { css, styled, units } from '@/hocs';

export enum HeaderVariant {
  SECONDARY = 'secondary',
  LINK = 'link',
}

export type HeaderLabelProps = {
  disabled?: boolean;
  variant?: HeaderVariant;
  hasToggle: boolean;
  isCollapsed: boolean;
  sectionVariant: SectionVariant;
};

const HeaderLabel = styled.div<HeaderLabelProps>`
  ${overflowTextStyles}

  ${({ hasToggle, isCollapsed, sectionVariant }) =>
    hasToggle &&
    sectionVariant === 'tertiary' &&
    (isCollapsed
      ? css`
          font-weight: 600 !important;
          color: #62778c !important;
        `
      : css`
          font-weight: 600 !important;
          color: #132144 !important;
        `)}

  /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
  min-width: 0;
  margin-right: ${units(1.5)}px;
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
      default:
        return css`
          font-weight: 600;
        `;
    }
  }}
`;

export default HeaderLabel;
