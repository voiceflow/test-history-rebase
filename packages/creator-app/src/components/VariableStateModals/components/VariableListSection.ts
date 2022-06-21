import { styled } from '@/hocs';

const VariableListSection = styled.div`
  max-height: calc(100vh - 536px);
  min-height: 40px;
  overflow: scroll;
  overflow-x: hidden;
  padding: 16px 32px 32px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export default VariableListSection;
