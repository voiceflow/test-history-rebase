import React from 'react';

import Example from '@/components/Example';
import Section from '@/components/Section';

export interface Example {
  title: string;
  component: React.FC;
}

export interface Section {
  path: string;
  title: string;
  examples: Example[];
}

export const createExample = (title: string, component: React.FC): Example => ({ title, component });

export const createSection = (title: string, path: string, examples: Example[]): Section => ({ path, title, examples });
