import { css, styled } from '@/hocs/styled';

interface ListenerContainerProps {
  listening: boolean;
}

const ListenerContainer = styled.div<ListenerContainerProps>`
  height: 100vh;
  width: 100vw;
  background: transparent;
  position: absolute;
  z-index: 100;

  ${({ listening }) =>
    listening &&
    css`
      outline: 5px solid #5d9df5;
      outline-offset: -5px;
    `}
`;

export default ListenerContainer;
