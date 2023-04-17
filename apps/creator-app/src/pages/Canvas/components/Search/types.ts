import React from 'react';

import { SearchTypes } from '@/contexts/SearchContext';

export interface SearchOption {
  label: React.ReactNode;
  entry: SearchTypes.DatabaseEntry;
}
