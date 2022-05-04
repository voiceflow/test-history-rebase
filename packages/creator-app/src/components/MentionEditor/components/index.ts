import { createGlobalStyle } from '@/hocs';
import { FadeDownDelayed, Slide } from '@/styles/animations';
import { Theme } from '@/styles/theme';

export { default as MentionEditorContainer } from './MentionEditorContainer';

export const mentionEditorStyle = ({ theme, height }: { theme: Theme; height?: number }) => {
  const styleObj = {
    input: {
      border: 'none',
      outline: 'none',
      borderRadius: 0,
      padding: 0,
      fontSize: '15px',
      overflow: 'initial',
      height: 'initial',
    },
    suggestions: {
      borderRadius: '5px',
      zIndex: theme.zIndex.popper,
      list: {
        width: '254px',
        maxHeight: '350px',
        padding: '8px 0',
        overflowY: 'auto',
        borderRadius: '5px',
        boxShadow: '0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)',
      },
      item: {
        padding: '9px 24px',

        '&focused': {
          backgroundColor: 'rgba(238, 244, 246, 0.85)',
        },
      },
    },
    highlighter: {},
  };

  if (height) {
    styleObj.input.overflow = 'auto';
    styleObj.input.height = `${height}px`;
    styleObj.highlighter = {
      boxSizing: 'border-box',
      overflow: 'hidden',
      height,
    };
  }
  return styleObj;
};

export const mentionStyle = {
  position: 'relative',
  zIndex: 1,
  color: '#5d9df5',

  // colored mentions are overlayed on plain text in textarea
  // following styling is to hide plain text
  backgroundColor: '#fff',
  textShadow: `1px 1px 1px white, 1px -1px 1px white, -1px 1px 1px white,
    -1px -1px 1px white`,
};

export const MentionSuggestionStyles = createGlobalStyle`
  .mentionInput__suggestions {
    ${Slide}
  }

  .mentionInput__suggestions__list {
    ${FadeDownDelayed}
  }
`;
