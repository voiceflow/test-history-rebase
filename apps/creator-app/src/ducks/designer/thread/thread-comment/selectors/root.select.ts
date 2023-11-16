import { createSubSelector } from '@/ducks/utils/selector';

import { root as threadRoot } from '../../selectors/root.select';
import { STATE_KEY } from '../thread-comment.state';

export const root = createSubSelector(threadRoot, STATE_KEY);
