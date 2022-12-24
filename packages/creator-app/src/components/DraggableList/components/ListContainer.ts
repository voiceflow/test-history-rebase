import { css, styled } from '@/hocs/styled';

const ListContainer = styled.div<{ fullHeight?: boolean }>`
  position: relative;
  width: 100%;

  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
      min-height: 100%;
    `};
`;

export default ListContainer;
