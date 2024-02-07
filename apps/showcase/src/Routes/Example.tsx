import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section, { Row } from '@/components/Section';
import Sidebar from '@/components/Sidebar';
import { isGroupedExamples } from '@/examples/utils';

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
          <Section path={section.path} title={section.title} description={section.description}>
            {isGroupedExamples(section.examples) ? (
              section.examples.map((examples, index) => (
                <Row key={index}>
                  {examples.map((example, index) => (
                    <Example key={index} title={example.title}>
                      <example.component />
                    </Example>
                  ))}
                </Row>
              ))
            ) : (
              <Row>
                {section.examples.map((example, index) => (
                  <Example key={index} title={example.title}>
                    <example.component />
                  </Example>
                ))}
              </Row>
            )}
          </Section>
        ) : (
          <Section title={`Example "${example}" doesn't exist`} path="/"></Section>
        )}
      </Content>
    </>
  );
};

export default ExampleRoute;

// Test comment
