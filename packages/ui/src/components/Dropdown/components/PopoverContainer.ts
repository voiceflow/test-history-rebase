import { css, styled } from '../../../styles';

type PopoverContainerProps = {
  zIndex?: number | string;
  noScroll?: boolean;
  autoWidth?: boolean;
};

const PopoverContainer = styled.div<PopoverContainerProps>`
  z-index: ${({ zIndex = 1100 }) => zIndex};

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
