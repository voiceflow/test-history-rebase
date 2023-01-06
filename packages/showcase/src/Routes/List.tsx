import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section from '@/components/Section';

import * as examples from '../examples';

const Content = styled.div`
  width: 100%;
  padding: 0 2em 2em;
  overflow: auto;
`;

const List: React.OldFC = () => {
  const history = useHistory();

  return (
    <Content>
      {Object.entries(examples).map(([path, section]) => (
        <Section key={path} title={section.title} path={section.path} onTitleClick={() => history.push(`/${path}`)}>
          {section.examples.map((example) => (
            <Example key={example.title} title={example.title}>
              <example.component />
            </Example>
          ))}
        </Section>
      ))}
    </Content>
  );
};

export default List;
