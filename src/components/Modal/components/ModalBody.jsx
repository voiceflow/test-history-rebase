import { styled, units } from '@/hocs';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: ${units(2)}px;

  & > span {
    display: inline-block;
  }
`;

export default ModalBody;
