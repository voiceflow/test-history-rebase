import { globalStyle, recipe, style } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

import { Z_INDEX } from './ModalContainer.constant';

const rootStyle = style({
  display: 'block',
  position: 'fixed',
  padding: '32px',
  width: '100%',
  height: '100%',
  overflow: ['clip', 'hidden'],
  zIndex: Z_INDEX,
  pointerEvents: 'none',
});

export const rootRecipe = recipe({
  base: rootStyle,
  variants: {
    stacked: {
      true: {
        gap: 16,
        display: 'flex',
        flexDirection: 'column',
      },
    },

    hidden: {
      true: {
        width: '0',
        height: '0',
        top: '0%',
        left: '0%',
        zIndex: '-1000',
        opacity: '0',
        overflow: 'hidden',
        visibility: 'hidden',
      },
    },
  },
});

globalStyle(`${rootStyle} > *`, {
  pointerEvents: 'auto',
});

export const containerStyles = recipe({
  base: {
    margin: '0 auto',
    maxHeight: '100%',
  },

  variants: {
    status: {
      entering: {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeIn}, transform ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeIn}`,
      },
      unmounted: {},
      entered: {
        opacity: 1,
        transform: 'translateY(0)',
      },
      exiting: {
        opacity: 0,
        transform: 'translateY(-15px)',
        transition: `opacity ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeOut}, transform ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeOut}`,
      },
      exited: {
        opacity: 0,
        transform: 'translateY(15px)',
      },
    },
    empty: {
      true: {
        display: 'none',
      },
    },
  },
});
