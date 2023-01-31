import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Example from '@/components/Example';
import Section, { Row } from '@/components/Section';
import { isGroupedExamples } from '@/examples/utils';

import * as examples from '../examples';

const Content = styled.div`
  width: 100%;
  padding: 0 2em 2em;
  overflow: auto;
`;

const List: React.FC = () => {
  const history = useHistory();

  const entries = React.useMemo(
    () =>
      Object.entries(examples).sort(([_a, sectionA], [_b, sectionB]) => {
        if (sectionA.title.includes('/') && !sectionB.title.includes('/')) return -1;
        if (!sectionA.title.includes('/') && sectionB.title.includes('/')) return 1;

        return sectionA.title.localeCompare(sectionB.title);
      }),
    [examples]
  );

  return (
    <Content>
      {entries.map(([path, section]) => (
        <Section key={path} title={section.title} description={section.description} path={section.path} onTitleClick={() => history.push(`/${path}`)}>
          {isGroupedExamples(section.examples) ? (
            section.examples.map((examples, index) => (
              <Row key={index}>
                {examples.map((example) => (
                  <Example key={example.title} title={example.title}>
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
      ))}
    </Content>
  );
};

export default List;
