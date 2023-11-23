import { datadogRum } from '@datadog/browser-rum';
import { Box, Button, ButtonVariant, Link, LOGROCKET_ENABLED, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import * as Documentation from '@/config/documentation';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { useAsyncMountUnmount, useSetup, useTrackingEvents } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import * as LogRocket from '@/vendors/logrocket';

const GooglePublish: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  const [googleProjectID, setGoogleProjectID] = React.useState<string | null>(null);
  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectGooglePublishPage();
  });

  useAsyncMountUnmount(async () => {
    if (!projectID) {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(Errors.noActiveProjectID());
      } else {
        datadogRum.addError(Errors.noActiveProjectID());
      }
      toast.genericError();

      return;
    }

    const member = await client.api.project.member.get(projectID);
    setGoogleProjectID((member?.platformData?.googleProjectID as string) || null);
  });

  return (
    <Settings.PageContent>
      <Settings.Section title="Publish">
        <Settings.Card>
          <Settings.SubSection contentProps={{ topOffset: 3 }}>
            <Box.FlexApart gap={24}>
              <div>
                <Settings.SubSection.Title>Actions Console</Settings.SubSection.Title>

                <Settings.SubSection.Description>
                  To publish your Google Action visit the Actions Console to submit your assistant for review.{' '}
                  <Link href={Documentation.GOOGLE_ACTIONS}>Learn More</Link>
                </Settings.SubSection.Description>
              </div>

              <Button nowrap variant={ButtonVariant.PRIMARY} disabled={!googleProjectID}>
                Open Console
              </Button>
            </Box.FlexApart>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default GooglePublish;
