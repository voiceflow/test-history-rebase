/* eslint-disable no-param-reassign */
import type { PopperModifier } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

export const popperPaddingModifierFactory = (options: {
  padding: number;
}): PopperModifier<'padding', { padding: number }> => ({
  name: 'padding',
  phase: 'beforeWrite',
  enabled: true,
  fn: ({ state }) => {
    const padding = `${options.padding}px`;

    if (state.placement.includes('left')) {
      state.styles.popper.paddingRight = padding;
      state.styles.arrow.left = `calc(100% - ${padding})`;
    } else if (state.placement.includes('right')) {
      state.styles.popper.paddingRight = padding;
      state.styles.arrow.right = `calc(100% - ${padding})`;
    }

    return state;
  },
});
