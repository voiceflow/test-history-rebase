import { styled, transition } from '@/hocs';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  min-height: 178px;
  padding: 24px;
  position: relative;
  cursor: pointer;
  user-select: none;

  ${transition('transform')}
`;

export default Container;
