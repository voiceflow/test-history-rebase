import { styled } from '@/hocs';
import { FadeUpDelayed, Slide } from '@/styles/animations';

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

  .mentionInput__suggestions {
    ${Slide}

    & > ul {
      ${FadeUpDelayed}
    }
  }
`;

export default MentionEditorContainer;
