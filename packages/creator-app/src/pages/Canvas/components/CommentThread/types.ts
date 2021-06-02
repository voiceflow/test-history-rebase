import React from 'react';

import { ThreadInstance } from '@/pages/Canvas/engine/entities/threadEntity';

export type InternalThreadInstance<T extends HTMLElement> = ThreadInstance & {
  ref: React.RefObject<T>;
};
