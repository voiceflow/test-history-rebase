/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import withRedux from 'stories/decorators/withRedux';

import DnDIcons from './index';

storiesOf('components/DnDIcons', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addDecorator(withRedux())
  .add('default', () => (
    <DragDropContextProvider backend={HTML5Backend}>
      <div className="panel-body">
        <DnDIcons
          smallUrl={text('smallUrl')}
          largeUrl={text('largeUrl')}
          onLoaded={action('onLoaded')}
          onProcessed={action('onProcessed')}
        />
      </div>
    </DragDropContextProvider>
  ));
