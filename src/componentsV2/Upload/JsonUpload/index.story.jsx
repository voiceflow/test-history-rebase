import React from 'react';

import { styled } from '@/hocs';

import JsonUpload from '.';

const Container = styled.div`
  width: 500px;
  margin-top: 10px;
`;

export default {
  title: 'Upload/JSON',
  component: JsonUpload,
};

export const normal = () => (
  <Container>
    <JsonUpload />
  </Container>
);
