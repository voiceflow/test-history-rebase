import React from 'react';

export interface ComponentProps extends React.PropsWithChildren {
  isPage?: boolean;
}

export interface ExampleOptions {
  fullWidth?: boolean;
}

export interface Example {
  title: string;
  options?: ExampleOptions;
  component: React.FC<ComponentProps>;
}

export interface Section {
  path: string;
  title: string;
  examples: Example[] | Example[][];
  description?: string;
}

export const createExample = (title: string, component: React.FC<ComponentProps>, options?: ExampleOptions): Example => ({
  title,
  options,
  component,
});

export const createSection = (title: string, path: string, examples: Example[]): Section => ({ path, title, examples });

export const configureExample = (example: Example): Example => example;
export const configureSection = (section: Section): Section => section;

export const isGroupedExamples = (examples: Example[] | Example[][]): examples is Example[][] => Array.isArray(examples[0]);
