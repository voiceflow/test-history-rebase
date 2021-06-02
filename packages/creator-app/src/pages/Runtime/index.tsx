import React from 'react';

import Alert from '@/components/Alert';
import Box from '@/components/Box';
import Input from '@/components/Input';
import Page from '@/components/Page';
import { ClickableText, Link, Text } from '@/components/Text';
import { toast } from '@/components/Toast';
import { API_ENDPOINT, GENERAL_RUNTIME_ENDPOINT_TAG, GENERAL_SERVICE_ENDPOINT } from '@/config';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { copy } from '@/utils/clipboard';
import * as Cookies from '@/utils/cookies';

const GENERAL_RUNTIME_REPO = 'https://github.com/voiceflow/general-runtime';

const RuntimeConfig: React.FC = () => {
  const auth = React.useMemo(() => Cookies.getAuthCookie(), []);
  const [runtimeEndpoint, updateRuntimeEndpoint] = React.useState(localStorage.getItem(GENERAL_RUNTIME_ENDPOINT_TAG) || '');

  const goToDashboard = useDispatch(Router.goToDashboard);

  const updateRuntime = (url: string) => {
    updateRuntimeEndpoint(url);
    localStorage.setItem(GENERAL_RUNTIME_ENDPOINT_TAG, url);
  };

  const onClickCopy = (text: string) => () => {
    copy(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Page navigateBackText="Back" onNavigateBack={goToDashboard}>
      <Box width={900} m="0 auto" p={60}>
        <h1>Runtime Configuration Options</h1>
        <hr />
        <Box mb={8}>
          <Link href={GENERAL_RUNTIME_REPO}>{GENERAL_RUNTIME_REPO}</Link>
        </Box>
        <Text>
          Update the General Runtime Endpoint to run the Voiceflow prototype tool off a custom general-runtime, or leave empty to default to Voiceflow
          hosted endpoint.
        </Text>

        <Box my={16}>
          <label>General Runtime Endpoint</label>
          <Input
            value={runtimeEndpoint}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRuntime(e.target.value)}
            placeholder="General Runtime Service Endpoint"
          />
        </Box>
        <Alert>
          Refresh Page to Apply Changes to <b>General Runtime Endpoint</b>
        </Alert>

        <hr />
        <h3>Environment Variables</h3>
        <Box my={16}>
          <label>Creator API Auth Token (CREATOR_API_AUTHORIZATION)</label>
          <Alert>
            <b>Creator API Auth Token</b> will stop working on signout or long inactivity
          </Alert>
          <Input value={auth} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={onClickCopy(auth)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
        <hr />
        <Box my={16}>
          <label>Creator API Endpoint (CREATOR_API_ENDPOINT)</label>
          <Input value={API_ENDPOINT} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={onClickCopy(API_ENDPOINT)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
        <hr />
        <Box my={16}>
          <label>General Service Endpoint (GENERAL_SERVICE_ENDPOINT)</label>
          <Input value={GENERAL_SERVICE_ENDPOINT} readOnly disabled />
          <Box mt={8}>
            <ClickableText onClick={onClickCopy(GENERAL_SERVICE_ENDPOINT)}>Copy To Clipboard</ClickableText>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default RuntimeConfig;
