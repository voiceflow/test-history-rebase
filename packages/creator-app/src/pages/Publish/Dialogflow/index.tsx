import { Box, BoxFlex, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { DIALOGFLOW_LEARN_MORE, getDialogflowProjectConsoleUrl } from '@/constants/platforms/dialogflow';
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
                To connect your Dialogflow agent to a chat or voice channel visit the Dialogflow Console.
              </Box>
              <Link href={DIALOGFLOW_LEARN_MORE}>Learn More</Link>
            </Box>

            <BoxFlex ml={16}>
              <Link href={actionsConsoleLink}>
                <Button variant={ButtonVariant.PRIMARY} disabled={!dialogflowProjectID} nowrap>
                  Dialogflow Console
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
