import { keyframes, recipe } from '@voiceflow/style';
import { Tokens } from '@voiceflow/ui-next/styles';

import { Z_INDEX } from '../ModalContainer/ModalContainer.constant';

const showKeyframes = keyframes({
  from: {
    opacity: 0,
    backdropFilter: 'grayscale(0)',
  },
  to: {
    opacity: 1,
    backdropFilter: 'grayscale(1)',
  },
});

const hideKeyframes = keyframes({
  from: {
    opacity: 1,
    backdropFilter: 'grayscale(1)',
  },
  to: {
    opacity: 0,
    backdropFilter: 'grayscale(0)',
  },
});

export const backdrop = recipe({
  base: {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100vh',
    width: '100vw',
    zIndex: Z_INDEX,
    background: 'rgba(25, 29, 34, 0.52)',
    cursor: 'pointer',
  },

  variants: {
    closePrevented: {
      true: {
        cursor: 'default',
      },
      false: {
        cursor: 'pointer',
      },
    },

    closing: {
      true: {
        animation: `${hideKeyframes} ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeOut}`,
        animationFillMode: 'both',
      },
      false: {
        animation: `${showKeyframes} ${Tokens.animation.duration.fast} ${Tokens.animation.timingFunction.easeIn}`,
        animationFillMode: 'both',
      },
    },
  },
});
