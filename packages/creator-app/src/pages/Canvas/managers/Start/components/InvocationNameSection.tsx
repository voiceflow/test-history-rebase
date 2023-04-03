import { Box, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';

const InvocationNameSection: React.FC = () => {
  const projectConfig = useActiveProjectTypeConfig();

  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const locales = useSelector(VersionV2.active.localesSelector);
  const invocationName = useSelector(VersionV2.active.invocationNameSelector);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');

  if (!projectConfig.project.invocationName) return null;

  const invocationError = projectConfig.utils.invocationName.validate({ value: newInvocation, locales }) || '';

  return (
    <SectionV2.SimpleSection isAccent>
      <Box width="100%">
        <Input
          error={!!invocationError}
          value={newInvocation}
          onBlur={() => !invocationError && updateInvocationName(newInvocation)}
          placeholder={projectConfig.project.invocationName.placeholder}
          onChangeText={setNewInvocation}
        />

        {invocationError && <SectionV2.ErrorMessage>{invocationError}</SectionV2.ErrorMessage>}
      </Box>
    </SectionV2.SimpleSection>
  );
};

export default InvocationNameSection;
