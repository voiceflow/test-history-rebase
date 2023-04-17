import { Box, BoxFlexCenter } from '@voiceflow/ui';
import React from 'react';
import styled from 'styled-components';

import type { ExampleOptions } from '../examples/utils';

const Container = styled(BoxFlexCenter)`
  flex-direction: column;
  margin: 2em;
`;

const Title = styled.h4`
  color: #c2c2c2;
  font-size: 1em;
  margin-top: 0.6em;
`;

interface ExampleProps extends ExampleOptions, React.PropsWithChildren {
  title: string;
}

const Example: React.FC<ExampleProps> = ({ title, children, fullWidth }) => (
  <Container width={fullWidth ? '100%' : undefined}>
    <Box width={fullWidth ? '100%' : undefined}>{children}</Box>
    <Title id={title}>{title}</Title>
  </Container>
);

export default Example;
