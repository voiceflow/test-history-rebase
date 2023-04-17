import { css, styled } from '@/hocs/styled';

const ListContainer = styled.div<{ flex?: boolean; fullHeight?: boolean }>`
  position: relative;
  width: 100%;

  ${({ fullHeight }) =>
    fullHeight &&
    css`
      height: 100%;
      min-height: 100%;
    `};

  ${({ flex }) =>
    flex &&
    css`
      display: flex;
      flex-direction: column;
    `};
`;

export default ListContainer;
