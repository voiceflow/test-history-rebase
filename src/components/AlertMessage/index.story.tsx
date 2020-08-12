import React from 'react';

import AlertMessage, { AlertMessageVariant } from '.';

export default {
  title: 'Alert Message',
  component: AlertMessage,
};

const message =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error eum fugit labore natus omnis quaerat quos ut voluptates. Accusamus delectus exercitationem ipsam ipsum itaque modi nesciunt non officiis saepe voluptates!';

export const primary = () => <AlertMessage variant={AlertMessageVariant.PRIMARY}>{message}</AlertMessage>;

export const warning = () => <AlertMessage variant={AlertMessageVariant.WARNING}>{message}</AlertMessage>;

export const danger = () => <AlertMessage variant={AlertMessageVariant.DANGER}>{message}</AlertMessage>;

export const success = () => <AlertMessage variant={AlertMessageVariant.SUCCESS}>{message}</AlertMessage>;
