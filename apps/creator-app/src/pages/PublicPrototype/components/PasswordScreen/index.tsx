import { Box } from '@voiceflow/ui';
import React from 'react';

import type * as PrototypeDuck from '@/ducks/prototype';

import FullPageTemplate from '../FullPageTemplate';
import { PasswordInput } from './components';

interface SharePasswordScreenProps {
  checkLogin: (password: string) => void;
  settings: PrototypeDuck.PrototypeSettings;
}

const SharePasswordScreen: React.FC<SharePasswordScreenProps> = ({ settings, checkLogin }) => (
  <Box height="100%">
    <FullPageTemplate centerAlign logoURL={settings.brandImage} colorScheme={settings.brandColor} hideVFBranding>
      <PasswordInput checkLogin={checkLogin} colorScheme={settings.brandColor} />
    </FullPageTemplate>
  </Box>
);

export default SharePasswordScreen;
