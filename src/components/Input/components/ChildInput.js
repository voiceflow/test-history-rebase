import { styled } from '@/hocs';

const ChildInput = styled.div`
  flex: 1;
  min-width: 50%;

  & > * {
    width: 100%;
  }
`;

export default ChildInput;
