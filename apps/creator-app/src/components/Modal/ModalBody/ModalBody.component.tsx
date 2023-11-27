import { Box, type IBox } from '@voiceflow/ui-next';
import React from 'react';

export const ModalBody: React.FC<IBox> = ({ pt = 20, px = 24, pb = 24, direction = 'column', ...props }) => (
  <Box pt={pt} px={px} pb={pb} direction={direction} {...props} />
);
