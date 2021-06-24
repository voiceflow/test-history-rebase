import { Box, BoxFlex, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { SettingsSection } from '@/components/Settings';
import * as Documentation from '@/config/documentation';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { Container } from './components';

const GooglePublish: React.FC<ConnectedGooglePublishProps> = ({ projectID }) => {
  const [googleProjectID, setGoogleProjectID] = React.useState<string | null>(null);

  useAsyncMountUnmount(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();

      return;
    }

    const member = await client.api.project.member.get(projectID);
    setGoogleProjectID((member?.platformData?.googleProjectID as string) || null);
  });

  return (
    <Container>
      <SettingsSection title="Publish">
        <Box alignItems="flex-end" display="flex">
          <Box m={32}>
            <Box mb={16} color="tertiary">
              To publish your Google Action visit the Actions Console to submit your project for review
            </Box>
            <Link href={Documentation.GOOGLE_ACTIONS}>Learn More</Link>
          </Box>
          <BoxFlex m={32}>
            <Link href={googleProjectID ? `https://console.actions.google.com/project/${googleProjectID}/directoryinformation/` : undefined}>
              <Button variant={ButtonVariant.SECONDARY} disabled={!googleProjectID} nowrap>
                Actions Console
              </Button>
            </Link>
          </BoxFlex>
        </Box>
      </SettingsSection>
    </Container>
  );
};

const mapStateToProps = {
  projectID: Session.activeProjectIDSelector,
};

type ConnectedGooglePublishProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(GooglePublish) as React.FC<ConnectedGooglePublishProps>;
