import { css, styled, units } from '@/hocs';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: ${units(2)}px;

  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}

  & > span {
    display: inline-block;
  }
`;

export default ModalBody;
