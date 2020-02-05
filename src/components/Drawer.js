import { css, styled } from '@/hocs';
import { SlideOut } from '@/styles/transitions';

const Drawer = styled(SlideOut)`
  height: 100%;
  top: 0;
  border-style: solid;
  border-width: 0;
  border-color: #dfe3ed;
  background-color: ${({ theme }) => theme.color.gradient[0]};

  ${({ direction = 'right' }) =>
    direction === 'right'
      ? css`
          border-right-width: 1px;
        `
      : css`
          border-left-width: 1px;
        `}

  ${({ scrollable }) =>
    scrollable &&
    css`
      overflow-y: scroll;
    `}
`;

export default Drawer;
