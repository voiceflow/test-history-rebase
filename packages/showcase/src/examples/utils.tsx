import React from 'react';

import Example from '@/components/Example';
import Page from '@/components/Page';
import Section from '@/components/Section';

export const createExample =
  (title: string, jsx: JSX.Element): React.FC =>
  () =>
    <Example title={title}>{jsx}</Example>;

export const createSection =
  (title: string, path: string, examples: React.FC[]): React.FC =>
  () =>
    (
      <Section title={title} path={path}>
        {examples.map((ExampleComponent, index) => (
          <ExampleComponent key={index} />
        ))}
      </Section>
    );

export const createPage =
  (sections: React.FC[]): React.FC =>
  () =>
    (
      <Page>
        {sections.map((SectionComponent, index) => (
          <SectionComponent key={index} />
        ))}
      </Page>
    );
