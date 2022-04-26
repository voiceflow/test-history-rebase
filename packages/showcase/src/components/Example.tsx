import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2em;
`;

const Title = styled.h4`
  color: #c2c2c2;
  font-size: 1em;
  margin-top: 0.6em;
`;

interface ExampleProps {
  title: string;
}

const Example: React.FC<ExampleProps> = ({ title, children }) => (
  <Container>
    <div>{children}</div>
    <Title id={title}>{title}</Title>
  </Container>
);

export default Example;
