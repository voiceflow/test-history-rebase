import { css, styled } from '@/hocs';

type PrototypeContainerProps = {
  generalPrototypeEnabled?: boolean;
};

const PrototypeContainer = styled.div<PrototypeContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  ${({ generalPrototypeEnabled }) =>
    generalPrototypeEnabled &&
    css`
      background-color: white;
    `}
`;

export default PrototypeContainer;
