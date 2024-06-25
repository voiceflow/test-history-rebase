import type React from 'react';

import type { SearchTypes } from '@/contexts/SearchContext';

export interface SearchOption {
  label: React.ReactNode;
  entry: SearchTypes.DatabaseEntry;
}
