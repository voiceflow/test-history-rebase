import React from 'react';

import { ThreadInstance } from '@/pages/Canvas/engine/entities/threadEntity';
import { Point } from '@/types';

export type InternalThreadInstance<T extends HTMLElement> = ThreadInstance & {
  ref: React.RefObject<T>;
  position: React.RefObject<Point>;
};
