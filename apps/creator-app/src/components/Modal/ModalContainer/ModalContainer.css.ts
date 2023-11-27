import { keyframes, recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

import { Z_INDEX } from './ModalContainer.constant';

export const rootRecipe = recipe({
  base: {
    display: 'block',
    position: 'fixed',
    padding: '32px',
    width: '100%',
    height: '100%',
    overflow: ['clip', 'hidden'],
    zIndex: Z_INDEX,
    pointerEvents: 'none',
  },
  variants: {
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

const showKeyframes = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(15px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const containerStyles = recipe({
  base: {
    margin: '0 auto',
    pointerEvents: 'auto',
    maxHeight: '100%',

    selectors: {
      '& + &': {
        marginTop: '24px',
      },
    },
  },

  variants: {
    status: {
      entering: {},
      unmounted: {},
      entered: {
        animation: `${showKeyframes} ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeIn}`,
        animationFillMode: 'backwards',
      },
      exiting: {
        opacity: 0,
        transform: 'translateY(-15px)',
        transition: `opacity ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeOut}, transform ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeOut}`,
      },
      exited: {
        opacity: 0,
        transform: 'translateY(-15px)',
      },
    },
  },
});
