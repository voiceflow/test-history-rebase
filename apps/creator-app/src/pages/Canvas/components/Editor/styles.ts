import { css, units } from '@/hocs/styled';

export const HEADER_HEIGHT = 64;
export const FOOTER_HEIGHT = 90;

export const dividerStyles = css`
  &:not(:first-child) {
    border-top: 1px solid #dfe3ed;
  }
`;

export const sectionStyles = css`
  ${dividerStyles}

  padding: 0 ${units(4)}px;
`;
