import React from 'react';
import styled from 'styled-components';

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2em;
`;

const ExampleTitle = styled.h4`
  color: #c2c2c2;
  font-size: 1em;
`;

interface ExampleProps {
  title: string;
}

const Example: React.FC<ExampleProps> = ({ title, children }) => (
  <ExampleContainer>
    {children}
    <ExampleTitle>{title}</ExampleTitle>
  </ExampleContainer>
);

export default Example;
