import { Box, Button, ButtonVariant, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks/redux';
import { copyWithToast } from '@/utils/clipboard';

const Metadata: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  return (
    <Settings.Section title="Metadata">
      <Settings.Card>
        <Settings.SubSection header="Project ID">
          <Box.Flex gap={16}>
            <Input value={projectID} disabled />
            <Button variant={ButtonVariant.SECONDARY} squareRadius flat onClick={copyWithToast(projectID)}>
              Copy
            </Button>
          </Box.Flex>
        </Settings.SubSection>
        <SectionV2.Divider />
        <Settings.SubSection header="Version ID">
          <Box.Flex gap={16}>
            <Input value={versionID} disabled />
            <Button variant={ButtonVariant.SECONDARY} squareRadius flat onClick={copyWithToast(versionID)}>
              Copy
            </Button>
          </Box.Flex>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default Metadata;
