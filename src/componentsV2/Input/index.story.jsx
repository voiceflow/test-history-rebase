import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Input, { ControlledInput } from '.';

storiesOf('Input', module)
  .add(
    'variants',
    createTestableStory(() => {
      const disabled = boolean('disabled', false);
      const error = boolean('error', false);

      const [inlineValue, setInlineValue] = React.useState('IS INPUT');

      return (
        <>
          <Variant label="normal">
            <div style={{ width: '300px' }}>
              <Input placeholder="placeholder" disabled={disabled} error={error} />
            </div>
          </Variant>
          <Variant label="inline">
            <div style={{ width: '300px' }}>
              <p>
                NOT INPUT&nbsp;
                <Input
                  variant="inline"
                  error={error}
                  placeholder="INPUT"
                  value={inlineValue}
                  onChange={(e) => setInlineValue(e.target.value)}
                  disabled={disabled}
                />
              </p>
            </div>
          </Variant>
          <Variant label="icon">
            <div style={{ width: '300px' }}>
              <Input icon="user" iconProps={{ color: 'rgba(93, 157, 245, 0.85)' }} placeholder="placeholder" disabled={disabled} error={error} />
            </div>
          </Variant>
          <Variant label="input elements">
            <div style={{ width: '300px' }}>
              <Input placeholder="input part" leftAction={<b>LEFT</b>} rightAction={<u>RIGHT</u>} error={error} disabled={disabled} />
            </div>
          </Variant>
        </>
      );
    })
  )
  .add(
    'controlled',
    createTestableStory(() => {
      const disabled = boolean('disabled', false);
      const complete = boolean('complete', false);
      const error = boolean('error', false);
      const message = text('message', 'right action');

      return (
        <Variant label="controlled input">
          <ControlledInput disabled={disabled} message={message} error={error} complete={complete} placeholder="placeholder" />
        </Variant>
      );
    })
  );
