import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as Session from '@/ducks/session';
import { useDeleteProject } from '@/hooks/project';
import { useSelector } from '@/hooks/redux';

const DangerZone: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const deletePrompt = useDeleteProject({
    projectID,
  });

  return (
    <Settings.Section title="Danger Zone">
      <Settings.Card>
        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart>
            <div>
              <Settings.SubSection.Title>Delete Agent</Settings.SubSection.Title>

              <Settings.SubSection.Description>This action can't be reverted. Please proceed with caution.</Settings.SubSection.Description>
            </div>

            <Button variant={ButtonVariant.SECONDARY} onClick={deletePrompt} squareRadius flat>
              Delete
            </Button>
          </Box.FlexApart>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default DangerZone;
