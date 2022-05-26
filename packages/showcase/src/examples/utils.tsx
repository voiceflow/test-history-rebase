import React from 'react';

import Example from '@/components/Example';
import Section from '@/components/Section';

interface ComponentProps {
  isPage?: boolean;
}

export interface Example {
  title: string;
  component: React.FC<ComponentProps>;
}

export interface Section {
  title: string;
  path: string;
  examples: Example[];
}

export const createExample = (title: string, component: React.FC<ComponentProps>): Example => ({ title, component });

export const createSection = (title: string, path: string, examples: Example[]): Section => ({ path, title, examples });
