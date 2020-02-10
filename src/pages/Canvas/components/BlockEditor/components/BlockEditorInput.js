import { styled } from '@/hocs';

const BlockEditorInput = styled.input`
  border: 0;
  font-size: 22px;
  font-weight: 600;
  color: #132144;
  text-overflow: ellipsis;

  &:active,
  &:focus {
    outline: 0;
  }
`;

export default BlockEditorInput;
