import { styled } from '@/hocs';

const ThreadEditorContainer = styled.div`
  width: 323px;
  border-radius: 5px;
  box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
  background: #fff;

  & > * {
    padding: 20px 18px;
    border-top: 1px solid #eaeff4;
  }

  & > :first-child {
    border: none;
  }
`;

export default ThreadEditorContainer;
