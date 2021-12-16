import { BlockText, BoxFlex, ClickableText, FullSpinner, Input, Link, Text, useToggle } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/AceEditor/Sample';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useIsAdmin, useSetup, useTrackingEvents } from '@/hooks';
import CreateAPIKeyModal from '@/pages/Workspace/Settings/components/Developer/modal';
import { copy } from '@/utils/clipboard';

import { ContentContainer, ContentSection, Section } from '../../components';
import { getSamples } from './utils';

const API: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState('');
  const [showKey, toggleShowKey] = useToggle(false);

  const isAdmin = useIsAdmin();

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const samples = getSamples(showKey ? key : '');

  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectApiPage();
  });

  useAsyncEffect(async () => {
    if (isAdmin) {
      const apiKeys = await client.project.listAPIKeys(projectID);
      if (apiKeys.length > 0) {
        setKey(apiKeys[0].key);
      } else {
        const apiKey = await client.project.createAPIKey({ workspaceID, projectID });
        setKey(apiKey.key);
      }
    }

    setLoading(false);
  }, [isAdmin, projectID]);

  if (loading) {
    return <FullSpinner />;
  }

  return (
    <>
      <CreateAPIKeyModal />

      <ContentContainer>
        <ContentSection>
          <Section title="Dialog API Documentation">
            <BlockText fontWeight={600} mb={8}>
              Dialog Management API
            </BlockText>
            <Text>
              Allow your Voiceflow project to be easily integrated into any conversational interface like a chatbot, voice assistant, IVR, web chat,
              and so much more.
            </Text>
            <BoxFlex justifyContent="flex-end" mt={12}>
              <Link href={DIALOG_MANAGER_API}>Learn More</Link>
            </BoxFlex>
          </Section>
        </ContentSection>

        {isAdmin && (
          <ContentSection>
            <Section title="Dialog API Key">
              <Text>Always store your token securely to protect your account.</Text>

              <BoxFlex flexGrow={1} mt={8} mb={4}>
                <Input
                  value={key}
                  type={!showKey ? 'password' : 'text'}
                  readOnly
                  rightAction={<ClickableText onClick={() => toggleShowKey()}>{showKey ? 'Hide' : 'Show'}</ClickableText>}
                />
              </BoxFlex>

              <ClickableText onClick={() => copy(key)}>Copy to clipboard</ClickableText>
            </Section>
          </ContentSection>
        )}

        <ContentSection>
          <Section title="API Call Examples" card={false}>
            <SampleEditor samples={samples} wrap={false} />
          </Section>
        </ContentSection>
      </ContentContainer>
    </>
  );
};

export default API;
