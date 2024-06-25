import type React from 'react';

import type { PortInstance } from '@/pages/Canvas/engine/entities/portEntity';

export type InternalPortInstance<T extends HTMLElement> = PortInstance & {
  ref: React.RefObject<T>;
};
