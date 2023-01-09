import Box from '@ui/components/Box';
import React from 'react';

const SnackbarText: React.FC<React.PropsWithChildren> = ({ children }) => <Box mr={16}>{children}</Box>;

export default SnackbarText;
