import { styled } from '@/hocs';

const VariableListSection = styled.div`
  max-height: 292px;
  min-height: 40px;
  overflow: scroll;
  overflow-x: hidden;
  padding: 24px 32px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

export default VariableListSection;
