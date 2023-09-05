import type { designerReducer } from './designer.reducer';

export const STATE_KEY = 'designer';

export type DesignerState = ReturnType<typeof designerReducer>;
