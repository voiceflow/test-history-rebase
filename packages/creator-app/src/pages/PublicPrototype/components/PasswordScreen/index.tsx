import { Box } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as PrototypeDuck from '@/ducks/prototype';
import { useGuestPermission } from '@/hooks';

import FullPageTemplate from '../FullPageTemplate';
import { PasswordInput } from './components';

interface SharePasswordScreenProps {
  checkLogin: (password: string) => void;
  settings: PrototypeDuck.PrototypeSettings;
}

const SharePasswordScreen: React.FC<SharePasswordScreenProps> = ({ settings, checkLogin }) => {
  const [isCustomizedPrototypeAllowed] = useGuestPermission(settings.plan, Permission.CUSTOMIZE_PROTOTYPE);

  return (
    <Box height="100%">
      <FullPageTemplate
        centerAlign={true}
        logoURL={isCustomizedPrototypeAllowed ? settings.brandImage : undefined}
        colorScheme={isCustomizedPrototypeAllowed ? settings.brandColor : undefined}
        hideVFBranding={isCustomizedPrototypeAllowed}
      >
        <PasswordInput checkLogin={checkLogin} colorScheme={settings.brandColor} />
      </FullPageTemplate>
    </Box>
  );
};

export default SharePasswordScreen;
