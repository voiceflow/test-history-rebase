/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, number, boolean, withKnobs } from '@storybook/addon-knobs';

import withRedux from 'stories/decorators/withRedux';

import { IconUploader } from './index';

storiesOf('components/IconUploader', module)
  .addDecorator(withRedux())
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <DragDropContextProvider backend={HTML5Backend}>
      <IconUploader
        id="id"
        url={text('url', '')}
        size={number('size', 108)}
        title={text('title', 'Title')}
        onLoaded={action('onLoaded')}
        onProcessed={action('onProcessed')}
        description={text('description', 'Description')}
      />
    </DragDropContextProvider>
  ))
  .add('with preload ', () => (
    <DragDropContextProvider backend={HTML5Backend}>
      <IconUploader
        id="id"
        url={text('url', '')}
        size={number('size', 108)}
        title={text('title', 'Title')}
        preload={boolean('preload', true)}
        onLoaded={action('onLoaded')}
        onProcessed={action('onProcessed')}
        description={text('description', 'Description')}
      />
    </DragDropContextProvider>
  ))
  .add('with url', () => (
    <DragDropContextProvider backend={HTML5Backend}>
      <IconUploader
        id="id"
        url={text('url', 'http://storyline.frontend.world/img/fish/fish-icon-large.png')}
        size={number('size', 108)}
        title={text('title', 'Title')}
        preload={boolean('preload', false)}
        onLoaded={action('onLoaded')}
        onProcessed={action('onProcessed')}
        description={text('description', 'Description')}
      />
    </DragDropContextProvider>
  ))
  .add('with replace button', () => (
    <DragDropContextProvider backend={HTML5Backend}>
      <IconUploader
        url={text('url', '')}
        size={number('size', 108)}
        title={text('title', 'Title')}
        preload={boolean('preload', false)}
        onLoaded={action('onLoaded')}
        onReplace={action('onReplace')}
        onProcessed={action('onProcessed')}
        withReplace={boolean('withReplace', true)}
        description={text('description', 'Description')}
      />
    </DragDropContextProvider>
  ));
