import { createDesignerSelector } from '../../utils/selector.util';
import { STATE_KEY } from '../knowledge-base.state';

export const root = createDesignerSelector(STATE_KEY);
