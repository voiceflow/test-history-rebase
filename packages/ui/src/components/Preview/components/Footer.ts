import { styled } from '@ui/styles';

import { PreviewColors } from '../constants';

const PreviewFooter = styled.div<{ noBackground?: boolean }>`
  background-color: ${PreviewColors.GREY_DARK_BACKGROUND_COLOR};
  padding: 12px 20px 16px 20px;
  display: flex;
  justify-content: flex-end;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  width: 100%;

  ${({ noBackground }) =>
    noBackground &&
    `
    background: transparent;
    padding-top: 0;
  `};
`;

export default PreviewFooter;
