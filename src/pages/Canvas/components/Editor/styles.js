import { css, units } from '@/hocs';

export const HEADER_HEIGHT = 60;
export const HEADER_HEIGHT_WITH_NAME = 100;
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
