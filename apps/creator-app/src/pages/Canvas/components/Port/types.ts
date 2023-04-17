import React from 'react';

import { PortInstance } from '@/pages/Canvas/engine/entities/portEntity';

export type InternalPortInstance<T extends HTMLElement> = PortInstance & {
  ref: React.RefObject<T>;
};
