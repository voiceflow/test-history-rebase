import { boolean, text } from '@storybook/addon-knobs';
import _ from 'lodash';
import React from 'react';

import { styled } from '@/hocs';

import DropUpload from '.';

const Container = styled.div`
  width: 500px;
  margin-top: 50px;
`;

const getProps = () => ({
  error: text('Error', null),
  canUseLink: boolean('can use link', true),
  label: text('Label', 'File'),
  success: boolean('Success', false),
  isLoading: boolean('Loading', false),
});

export default {
  title: 'Upload/Primitive/Drop',
  component: DropUpload,
};

export const normal = () => (
  <Container>
    <DropUpload
      onDropAccepted={_.noop}
      clearError={() => _.noop}
      onDropRejected={_.noop}
      switchMode={_.noop}
      cornerIcon="star"
      cornerAction={_.noop}
      successLabel="Foo.mp3"
      acceptedFileTypes="audio/mpeg"
      {...getProps()}
    />
  </Container>
);
