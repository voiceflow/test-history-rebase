import { styled } from '@/hocs';

const VariableListSection = styled.div`
  max-height: calc(100vh - 590px);
  min-height: 40px;
  overflow: scroll;
  overflow-x: hidden;
  padding: 24px 32px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export default VariableListSection;
