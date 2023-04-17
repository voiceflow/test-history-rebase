import { datadogRum } from '@datadog/browser-rum';
import { Box, Button, ButtonVariant, Link, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import * as Errors from '@/config/errors';
import { DIALOGFLOW_ES_LEARN_MORE, getDialogflowESProjectConsoleUrl } from '@/constants/platforms/dialogflowES';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSelector, useSetup, useTrackingEvents } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

const DialogflowPublish: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const [dialogflowProjectID, setDialogflowProjectID] = React.useState<string | null>(null);
  const [trackingEvents] = useTrackingEvents();
  const actionsConsoleLink = dialogflowProjectID ? getDialogflowESProjectConsoleUrl(dialogflowProjectID) : undefined;

  useSetup(() => {
    trackingEvents.trackActiveProjectGooglePublishPage();
  });

  useAsyncMountUnmount(async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();

      return;
    }

    const member = await client.api.project.member.get(projectID);
    setDialogflowProjectID((member?.platformData?.googleProjectID as string) || null);
  });

  return (
    <Settings.PageContent>
      <Settings.Section title="Publish">
        <Settings.Card>
          <Settings.SubSection contentProps={{ topOffset: 3 }}>
            <Box.FlexApart gap={24}>
              <div>
                <Settings.SubSection.Title>Dialogflow Console</Settings.SubSection.Title>

                <Settings.SubSection.Description>
                  To connect your Dialogflow agent to a chat or voice channel upload your assistant from the canvas.{' '}
                  <Link href={DIALOGFLOW_ES_LEARN_MORE}>Learn More</Link>
                </Settings.SubSection.Description>
              </div>

              <Button
                nowrap
                variant={ButtonVariant.PRIMARY}
                onClick={() => actionsConsoleLink && openURLInANewTab(actionsConsoleLink)}
                disabled={!dialogflowProjectID}
              >
                Open Console
              </Button>
            </Box.FlexApart>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default DialogflowPublish;
