import {withState} from 'recompose';

export const keyboardModal = withState("keyboardHelp", "toggleKeyboard", false)
export const helpModal = withState("helpOpen", "toggleHelpOpen", null);
export const upgradeModal = withState("upgradeModal", "toggleUpgrade", false)