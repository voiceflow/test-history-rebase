import { Box, Button, ButtonVariant, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as Session from '@/ducks/session';
import { useDeleteProject, useSelector } from '@/hooks';

const DangerZone: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const deletePrompt = useDeleteProject({
    projectID,
  });

  return (
    <SettingsSection variant={SectionVariants.PRIMARY} title="Danger Zone" marginBottom={40}>
      <SettingsSubSection topOffset={3} growInput={false}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>
              <Text>Delete Assistant</Text>
            </SectionV2.Title>
            <Box mt={4}>
              <Text color="#62778c" fontSize="13px">
                This action can't be reverted. Please proceed with caution.
              </Text>
            </Box>
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
