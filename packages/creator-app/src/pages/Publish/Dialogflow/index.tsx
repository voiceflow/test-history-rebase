import { Box, BoxFlex, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Documentation from '@/config/documentation';
import * as Errors from '@/config/errors';
import { getDialogflowProjectConsoleUrl } from '@/constants/platforms/dialogflow';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import { ContentContainer, ContentSection, Section } from '../components';

const DialogflowPublish: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [dialogflowProjectID, setDialogflowProjectID] = React.useState<string | null>(null);
  const [trackingEvents] = useTrackingEvents();
  const actionsConsoleLink = dialogflowProjectID ? getDialogflowProjectConsoleUrl(dialogflowProjectID) : undefined;

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
    setDialogflowProjectID((member?.platformData?.googleProjectID as string) || null);
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
              <Link href={actionsConsoleLink}>
                <Button variant={ButtonVariant.SECONDARY} disabled={!dialogflowProjectID} nowrap>
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

export default DialogflowPublish;
