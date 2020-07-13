import { styled } from '@/hocs';

const MentionEditorContainer = styled.div`
  position: relative;

  /* to prevent placeholder jump on typing */
  .mentionInput__input::placeholder {
    padding-top: 2px;
  }
`;

export default MentionEditorContainer;
