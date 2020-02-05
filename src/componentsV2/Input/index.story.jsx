import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';

import Input, { ControlledInput } from '.';

const getProps = () => ({
  disabled: boolean('disabled', false),
  error: boolean('error', false),
});

export default {
  title: 'Input',
  component: Input,
  includeStories: [],
};

export const normal = () => (
  <div style={{ width: '300px' }}>
    <Input placeholder="placeholder" {...getProps()} />
  </div>
);

export const inline = () => {
  const [inlineValue, setInlineValue] = React.useState('IS INPUT');

  return (
    <div style={{ width: '300px' }}>
      <p>
        NOT INPUT&nbsp;
        <Input variant="inline" placeholder="INPUT" value={inlineValue} onChange={(e) => setInlineValue(e.target.value)} {...getProps()} />
      </p>
    </div>
  );
};

export const icon = () => (
  <div style={{ width: '300px' }}>
    <Input icon="user" iconProps={{ color: 'rgba(93, 157, 245, 0.85)' }} placeholder="placeholder" {...getProps()} />
  </div>
);

export const withInputElement = () => (
  <div style={{ width: '300px' }}>
    <Input placeholder="input part" leftAction={<b>LEFT</b>} rightAction={<u>RIGHT</u>} {...getProps()} />
  </div>
);

export const controlled = () => {
  const message = text('message', 'right action');
  const complete = boolean('complete', false);

  return <ControlledInput message={message} complete={complete} placeholder="placeholder" {...getProps()} />;
};
