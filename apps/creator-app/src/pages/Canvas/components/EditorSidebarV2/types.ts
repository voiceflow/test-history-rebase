import type { ExtractRouteParams } from 'react-router';

import type { EditorAnimationEffect } from '../../constants';

export interface GoToTypes<S extends string> {
  path: S;
  params?: ExtractRouteParams<S>;
  animationEffect?: EditorAnimationEffect;
  state?: Record<string, unknown>;
}
