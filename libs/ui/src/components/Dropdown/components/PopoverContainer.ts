import { css, styled } from '@ui/styles';

interface PopoverContainerProps {
  zIndex?: number | string;
  noScroll?: boolean;
  autoWidth?: boolean;
}

const PopoverContainer = styled.div<PopoverContainerProps>`
  z-index: ${({ theme, zIndex = theme.zIndex.popper }) => zIndex};

  /* to override default width css from react-popper */
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};

  ${({ noScroll }) =>
    noScroll
      ? css`
          ul {
            max-height: none !important;
            padding: 0;

            * {
              max-height: none !important;
            }
          }
        `
      : ''}
`;

export default PopoverContainer;
