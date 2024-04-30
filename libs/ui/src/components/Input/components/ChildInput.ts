import { styled } from '@/styles';

// min-width: 1% is required to ensure input has width
const ChildInput = styled.div`
  flex: 1;
  min-width: 1%;

  & > * {
    width: 100%;
  }
`;

export default ChildInput;
