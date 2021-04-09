import React from 'react';

import Box from '@/components/Box';
import * as PrototypeDuck from '@/ducks/prototype';

import FullPageTemplate from '../FullPageTemplate';
import { PasswordInput } from './components';

type SharePasswordScreenProps = {
  checkLogin: (password: string) => void;
  settings: PrototypeDuck.PrototypeSettings;
};
const SharePasswordScreen: React.FC<SharePasswordScreenProps> = ({ settings, checkLogin }) => (
  <Box height="100%">
    <FullPageTemplate centerAlign={true} logoURL={settings.brandImage} colorScheme={settings.brandColor}>
      <PasswordInput checkLogin={checkLogin} colorScheme={settings.brandColor} />
    </FullPageTemplate>
  </Box>
);

export default SharePasswordScreen;
