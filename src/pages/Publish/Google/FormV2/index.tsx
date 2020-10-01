import React from 'react';

import clientV2 from '@/clientV2';
import Box, { Flex } from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import { Link } from '@/components/Text';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ContentSection } from '@/pages/Settings/components/SettingsContent/components';
import { ConnectedProps } from '@/types';

import { Container } from './components';

const GooglePublish: React.FC<ConnectedGooglePublishProps> = ({ projectID }) => {
  const [googleProjectID, setGoogleProjectID] = React.useState<string | null>(null);

  useAsyncMountUnmount(async () => {
    const member = await clientV2.api.project.member.get(projectID);
    setGoogleProjectID((member?.platformData?.googleProjectID as string) || null);
  });

  return (
    <Container>
      <ContentSection title="Publish">
        <Box alignItems="flex-end" display="flex">
          <Box m={32}>
            <Box mb={16} color="tertiary">
              To publish your Google Action visit the Actions Console to submit your project for review
            </Box>
            <Link href="https://docs.voiceflow.com/#/google/actions-console">Learn More</Link>
          </Box>
          <Flex m={32}>
            <Link href={googleProjectID ? `https://console.actions.google.com/project/${googleProjectID}/directoryinformation/` : undefined}>
              <Button variant={ButtonVariant.SECONDARY} disabled={!googleProjectID} nowrap>
                Actions Console
              </Button>
            </Link>
          </Flex>
        </Box>
      </ContentSection>
    </Container>
  );
};

const mapStateToProps = {
  projectID: Skill.activeProjectIDSelector,
};

type ConnectedGooglePublishProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(GooglePublish) as React.FC<ConnectedGooglePublishProps>;
