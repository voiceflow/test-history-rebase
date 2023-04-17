import { styled } from '@/hocs/styled';

const MentionEditorContainer = styled.div`
  position: relative;

  /* to prevent placeholder jump on typing */
  .mentionInput__input::placeholder {
    padding-top: 2px;
  }

  /* to override default styling and text jump when switched to editing mode */
  .mentionInput__highlighter {
    border: none !important;
  }
`;

export default MentionEditorContainer;
