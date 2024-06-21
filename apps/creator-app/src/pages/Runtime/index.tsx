import { Box, ClickableText, Input, Link, Text } from '@voiceflow/ui';
import React from 'react';

import Alert from '@/components/legacy/Alert';
import Page from '@/components/Page';
import { API_ENDPOINT, GENERAL_RUNTIME_ENDPOINT_TAG, GENERAL_SERVICE_ENDPOINT } from '@/config';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { copyWithToast } from '@/utils/clipboard';
import * as Cookies from '@/utils/cookies';

const GENERAL_RUNTIME_REPO = 'https://github.com/voiceflow/general-runtime';

const RuntimeConfig: React.FC = () => {
  const auth = React.useMemo(() => Cookies.getAuthCookie(), []);
  const [runtimeEndpoint, updateRuntimeEndpoint] = React.useState(
    localStorage.getItem(GENERAL_RUNTIME_ENDPOINT_TAG) || ''
  );

  const goToDashboard = useDispatch(Router.goToDashboard);

  const updateRuntime = (url: string) => {
    updateRuntimeEndpoint(url);
    localStorage.setItem(GENERAL_RUNTIME_ENDPOINT_TAG, url);
  };

  return (
    <Page
      renderHeader={() => (
        <Page.Header>
          <Page.Header.BackButton onClick={() => goToDashboard()} />
          <Page.Header.Title>Runtime Configuration Options</Page.Header.Title>
        </Page.Header>
      )}
    >
      <Box width={900} m="0 auto" p={60}>
        <Box mb={8}>
          <Link href={GENERAL_RUNTIME_REPO}>{GENERAL_RUNTIME_REPO}</Link>
        </Box>
        <Text>
          Update the General Runtime Endpoint to run the Voiceflow prototype tool off a custom general-runtime, or leave
          empty to default to Voiceflow hosted endpoint.
        </Text>

        <Box my={16}>
          <label>General Runtime Endpoint</label>
          <Input value={runtimeEndpoint} placeholder="General Runtime Service Endpoint" onChangeText={updateRuntime} />
        </Box>

        <Alert mb={16}>
          Refresh Page to Apply Changes to <b>General Runtime Endpoint</b>
        </Alert>

        <hr />
        <h3>Environment Variables</h3>
        <Box my={16}>
          <label>Creator API Auth Token (CREATOR_API_AUTHORIZATION)</label>
          <Alert mb={16}>
            <b>Creator API Auth Token</b> will stop working on signout or long inactivity
          </Alert>
          <Input value={auth} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={copyWithToast(auth)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
        <hr />
        <Box my={16}>
          <label>Creator API Endpoint (CREATOR_API_ENDPOINT)</label>
          <Input value={API_ENDPOINT} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={copyWithToast(API_ENDPOINT)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
        <hr />
        <Box my={16}>
          <label>General Service Endpoint (GENERAL_SERVICE_ENDPOINT)</label>
          <Input value={GENERAL_SERVICE_ENDPOINT} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={copyWithToast(GENERAL_SERVICE_ENDPOINT)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default RuntimeConfig;
