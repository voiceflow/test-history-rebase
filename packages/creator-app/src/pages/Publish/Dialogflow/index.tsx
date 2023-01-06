import { Box, BoxFlex, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { DIALOGFLOW_ES_LEARN_MORE, getDialogflowESProjectConsoleUrl } from '@/constants/platforms/dialogflowES';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import { ContentContainer, ContentSection, Section } from '../components';

const DialogflowPublish: React.OldFC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [dialogflowProjectID, setDialogflowProjectID] = React.useState<string | null>(null);
  const [trackingEvents] = useTrackingEvents();
  const actionsConsoleLink = dialogflowProjectID ? getDialogflowESProjectConsoleUrl(dialogflowProjectID) : undefined;

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
      <ContentSection style={{ width: '700px' }}>
        <Section title="Publish">
          <BoxFlex alignItems="flex-end">
            <Box>
              <Box mr={20} mb={16} color="secondary">
                To connect your Dialogflow agent to a chat or voice channel upload your project from the canvas.
              </Box>
              <Link href={DIALOGFLOW_ES_LEARN_MORE}>Learn More</Link>
            </Box>

            <BoxFlex alignItems="flex-end">
              <Box mt={32} ml={20}>
                <Link href={actionsConsoleLink}>
                  <Button variant={ButtonVariant.PRIMARY} disabled={!dialogflowProjectID} nowrap>
                    Dialogflow Console
                  </Button>
                </Link>
              </Box>
            </BoxFlex>
          </BoxFlex>
        </Section>
      </ContentSection>
    </ContentContainer>
  );
};

export default DialogflowPublish;
