import { withState } from 'recompose';

export const keyboardModal = withState('keyboardHelp', 'toggleKeyboard', false);
export const helpModal = withState('helpOpen', 'toggleHelpOpen', null);
