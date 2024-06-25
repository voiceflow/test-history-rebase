import { Animations } from '@voiceflow/ui';

import { createGlobalStyle } from '@/hocs/styled';
import type { Theme } from '@/styles/theme';

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
      borderRadius: '8px',
      zIndex: theme.zIndex.popper,
      list: {
        width: '254px',
        maxHeight: '350px',
        padding: '8px 0',
        overflowY: 'auto',
        borderRadius: '6px',
        boxShadow:
          '0px 12px 24px rgba(19, 33, 68, 0.04), 0px 8px 12px rgba(19, 33, 68, 0.04), 0px 4px 4px rgba(19, 33, 68, 0.02), 0px 2px 2px rgba(19, 33, 68, 0.01), 0px 1px 1px rgba(19, 33, 68, 0.01), 0px 0px 0px rgba(17, 49, 96, 0.03), 0px 0px 0px 1px rgba(17, 49, 96, 0.06)',
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
    ${Animations.slideInStyle}
  }

  .mentionInput__suggestions__list {
    ${Animations.fadeInDownDelayedStyle}
  }
`;
