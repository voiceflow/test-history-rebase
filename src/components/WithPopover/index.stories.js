/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';

import WithPopover from './index';

storiesOf('components/WithPopover', module)
  .addDecorator(centered)
  .add('default', () => (
    <WithPopover
      target={({ show, onRef, opened }) => (
        <div ref={onRef} onClick={show}>
          {opened ? 'Close' : 'Show'} Popover
        </div>
      )}
      className="__w-420"
    >
      {() => (
        <div className="popover-text">
          <p>
            Example phrases guide customers on how to interact with your skill, depending on whether
            it is a single interaction or a conversation.
          </p>
        </div>
      )}
    </WithPopover>
  ));
