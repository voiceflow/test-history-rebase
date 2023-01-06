import { Box, Button, ButtonVariant, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as Session from '@/ducks/session';
import { useDeleteProject } from '@/hooks/project';
import { useSelector } from '@/hooks/redux';

const DangerZone: React.OldFC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const deletePrompt = useDeleteProject({
    projectID,
  });

  return (
    <SettingsSection variant={SectionVariants.PRIMARY} title="Danger Zone" marginBottom={40}>
      <SettingsSubSection topOffset={3} growInput={false}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>Delete Assistant</SectionV2.Title>

            <SectionV2.Description mt={4} block secondary>
              This action can't be reverted. Please proceed with caution.
            </SectionV2.Description>
          </div>

          <Button variant={ButtonVariant.SECONDARY} onClick={deletePrompt} squareRadius flat>
            Delete
          </Button>
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default DangerZone;
