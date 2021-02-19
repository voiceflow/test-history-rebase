import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import { styled } from '@/hocs';
import { noop } from '@/utils/functional';

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
      onDropAccepted={noop}
      clearError={() => noop}
      onDropRejected={noop}
      switchMode={noop}
      cornerIcon="star"
      cornerAction={noop}
      successLabel="Foo.mp3"
      acceptedFileTypes="audio/mpeg"
      {...getProps()}
    />
  </Container>
);
