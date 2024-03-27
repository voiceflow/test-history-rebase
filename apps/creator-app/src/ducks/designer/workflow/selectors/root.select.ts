import { createDesignerSelector } from '../../utils/selector.util';
import { STATE_KEY } from '../workflow.state';

export const root = createDesignerSelector(STATE_KEY);
