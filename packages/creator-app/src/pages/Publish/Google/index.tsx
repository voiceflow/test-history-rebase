import { Box, BoxFlex, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Documentation from '@/config/documentation';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSetup, useTrackingEvents } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import * as Sentry from '@/vendors/sentry';

import { ContentContainer, ContentSection, Section } from '../components';

const GooglePublish: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  const [googleProjectID, setGoogleProjectID] = React.useState<string | null>(null);
  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectGooglePublishPage();
  });

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
    <ContentContainer>
      <ContentSection>
        <Section title="Publish">
          <BoxFlex alignItems="flex-end">
            <Box>
              <Box mb={16} color="tertiary">
                To publish your Google Action visit the Actions Console to submit your project for review
              </Box>
              <Link href={Documentation.GOOGLE_ACTIONS}>Learn More</Link>
            </Box>

            <BoxFlex ml={16}>
              <Link href={googleProjectID ? `https://console.actions.google.com/project/${googleProjectID}/directoryinformation/` : undefined}>
                <Button variant={ButtonVariant.SECONDARY} disabled={!googleProjectID} nowrap>
                  Actions Console
                </Button>
              </Link>
            </BoxFlex>
          </BoxFlex>
        </Section>
      </ContentSection>
    </ContentContainer>
  );
};

export default GooglePublish;
