import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section from '@/components/Section';
import Sidebar from '@/components/Sidebar';

import * as examples from '../examples';

const Content = styled.div`
  width: 100%;
  padding: 0 2em;
  overflow-x: hidden;
  overflow-x: clip;
  overflow-y: auto;
  background-color: #fafafa;
`;

const ExampleRoute: React.FC = () => {
  const { example } = useParams<{ example?: keyof typeof examples }>();

  const section = example && examples[example];

  return (
    <>
      <Sidebar />

      <Content>
        {section ? (
          <Section title={section.title} path={section.path}>
            {section.examples.map((example) => (
              <Example {...example.options} key={example.title} title={example.title}>
                <example.component isPage />
              </Example>
            ))}
          </Section>
        ) : (
          <Section title={`Example "${example}" doesn't exist`} path="/"></Section>
        )}
      </Content>
    </>
  );
};

export default ExampleRoute;
