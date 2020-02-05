import React from 'react';

import AlertMessage from './index';

export default {
  title: 'Alert Message',
  component: AlertMessage,
};

const message =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error eum fugit labore natus omnis quaerat quos ut voluptates. Accusamus delectus exercitationem ipsam ipsum itaque modi nesciunt non officiis saepe voluptates!';

export const primary = () => <AlertMessage variant="primary" message={message} />;

export const warning = () => <AlertMessage variant="warning" message={message} />;

export const danger = () => <AlertMessage variant="danger" message={message} />;

export const success = () => <AlertMessage variant="success" message={message} />;
