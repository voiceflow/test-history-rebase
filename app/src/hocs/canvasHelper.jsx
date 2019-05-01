import { withState } from 'recompose'

export const open = withState('open', 'setOpen', false);
export const blockMenu = withState('blockMenu', 'setBlockMenu', null);

