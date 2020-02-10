import { button, text } from '@storybook/addon-knobs';
import React from 'react';

import { ToastContainer, toast } from '.';

export default {
  title: 'Toast',
  component: ToastContainer,
  includeStories: [],
};

export const variants = () => {
  const ref = React.useRef();

  ref.current = text('message', 'Toast message!');

  button('default', () => toast(ref.current));
  button('info', () => toast.info(ref.current));
  button('success', () => toast.success(ref.current));
  button('warning', () => toast.warning(ref.current));
  button('error', () => toast.error(ref.current));

  return <ToastContainer />;
};
