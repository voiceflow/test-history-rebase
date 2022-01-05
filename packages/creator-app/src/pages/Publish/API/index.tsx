import { BlockText, Box, BoxFlex, Button, ButtonVariant, FullSpinner, Input, Link, SvgIcon, Text, ThemeColor, toast, useToggle } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import SampleEditor from '@/components/AceEditor/Sample';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useIsAdmin, useSetup, useTrackingEvents } from '@/hooks';
import CreateAPIKeyModal from '@/pages/Workspace/Settings/components/Developer/modal';
import { copy } from '@/utils/clipboard';

import { ContentContainer, ContentSection, FlatCard, Section } from '../components';
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

  const copyKey = React.useCallback(() => {
    copy(key);
    toast.success('Copied API Key');
  }, [key]);

  if (loading) {
    return <FullSpinner />;
  }

  return (
    <>
      <CreateAPIKeyModal />

      <ContentContainer>
        <ContentSection>
          <FlatCard m={12}>
            <BoxFlex justifyContent="flex-end">
              <SvgIcon size={64} icon="globe" />
              <Box ml={24}>
                <BlockText fontWeight={600} mb={8} color={ThemeColor.PRIMARY}>
                  API Documentation
                </BlockText>
                <Text>
                  Integrate your Voiceflow project with any conversational interface like a chatbot, voice assistant, IVR, web chat, and much more.{' '}
                  <Link href={DIALOG_MANAGER_API}>See documentation</Link>
                </Text>
              </Box>
            </BoxFlex>
          </FlatCard>
        </ContentSection>

        {isAdmin && (
          <ContentSection>
            <Section title="Dialog API Key">
              <BoxFlex mb={12}>
                <Input
                  value={key}
                  type={showKey ? 'text' : 'password'}
                  readOnly
                  rightAction={
                    <SvgIcon
                      icon={showKey ? 'eye' : 'eyeHide'}
                      onClick={() => toggleShowKey()}
                      color="#becedc"
                      clickable
                      style={{ userSelect: 'none' }}
                    />
                  }
                />
                <Box ml={16}>
                  <Button onClick={copyKey} variant={ButtonVariant.PRIMARY} squareRadius>
                    Copy
                  </Button>
                </Box>
              </BoxFlex>
              <Text fontSize={13}>
                <SvgIcon icon="warning" inline mb={-3} mr={10} />
                Always store your token securely to protect your account.
              </Text>
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
