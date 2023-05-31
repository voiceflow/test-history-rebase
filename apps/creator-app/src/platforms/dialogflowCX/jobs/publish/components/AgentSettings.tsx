import {
  Box,
  Divider,
  Input,
  Link,
  OverflowText,
  SvgIcon,
  ThemeColor,
  useDebouncedCallback,
  usePersistFunction,
  useSmartReducerV2,
} from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import IntentsSelect from '@/components/IntentsSelect';
import RadioGroup from '@/components/RadioGroup';
import { DIALOGFLOW_CX_LEARN_MORE } from '@/constants/platforms';
import * as Account from '@/ducks/account';
import * as Project from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import type { AgentName, GCPAgent } from '@/platforms/dialogflowCX/types';
import logger from '@/utils/logger';

const AGENT_RESOURCE_REGEX = /(projects\/((\w|-)+)\/locations\/((\w|-)+)\/agents\/((\w|-)+))/;

enum INTENT_UPLOAD_TYPE {
  ALL = 'all',
  SELECT = 'select',
}
const INTENT_OPTIONS = [
  { id: INTENT_UPLOAD_TYPE.ALL, label: 'Upload all intents' },
  { id: INTENT_UPLOAD_TYPE.SELECT, label: 'Upload select intents' },
];

interface WaitAgentState {
  error: string | null;
  rawUrl: string;
  verifiedAgent: GCPAgent | null;
  intentUploadType: INTENT_UPLOAD_TYPE;
}

interface AgentSettingsProps {
  onValid?: (valid: boolean) => void;
  waitOnAgent?: boolean;
}

const AgentSettings: React.FC<AgentSettingsProps> = ({ onValid, waitOnAgent = true }) => {
  const selectedIntents: string[] = useSelector(VersionV2.active.publishingSelector)?.selectedIntents || [];
  const agent: GCPAgent | null = useSelector(Project.active.platformDataSelector)?.agent || null;

  const patchVersionPublishing = useDispatch(Version.patchPublishing);
  const patchProjectPlatformData = useDispatch(Project.patchActivePlatformData);
  const hasGoogleAccount = !!useSelector(Account.googleAccountSelector);

  const [state, api] = useSmartReducerV2<WaitAgentState>({
    error: null,
    rawUrl: agent?.name || '',
    verifiedAgent: null,
    intentUploadType: selectedIntents.length ? INTENT_UPLOAD_TYPE.SELECT : INTENT_UPLOAD_TYPE.ALL,
  });

  const updateSelectedIntents = usePersistFunction((selectedIntents: string[]) => {
    patchVersionPublishing({ selectedIntents });
  });

  const updateAgent = useDebouncedCallback(200, async (agentResouce: AgentName) => {
    try {
      const agent = await client.platform.dialogflowCX.legacyPublish.checkAgent(agentResouce);
      await patchProjectPlatformData({ agent: { name: agent.name, displayName: agent.displayName } });
      api.update({ verifiedAgent: agent, error: null });
    } catch (error) {
      logger.error(error);
      api.update({ error: 'Agent is not accessible.', verifiedAgent: null });
    }
  });

  const updateURL = usePersistFunction((rawUrl: string) => {
    api.update({ rawUrl, error: null });
    if (!rawUrl) {
      api.update({ error: null });
      return;
    }

    const match = rawUrl.match(AGENT_RESOURCE_REGEX);
    if (!match) {
      api.update({ error: 'URL is invalid.', verifiedAgent: null });
      return;
    }

    const agentName = match[0] as AgentName;
    updateAgent(agentName);
  });

  const updateIntentUploadType = usePersistFunction((intentUploadType: INTENT_UPLOAD_TYPE) => {
    if (intentUploadType === INTENT_UPLOAD_TYPE.ALL) updateSelectedIntents([]);
    api.update({ intentUploadType });
  });

  React.useEffect(() => {
    onValid?.(!!state.verifiedAgent);
  }, [!!state.verifiedAgent]);

  React.useEffect(() => {
    // run an initial check on load
    if (state.rawUrl) updateURL(state.rawUrl);
  }, []);

  const InputInfo = () => {
    if (state.error) {
      return (
        <Box.Flex mt={12} color={ThemeColor.RED} fontSize={13}>
          <SvgIcon icon="warning" marginRight={9} />
          <span>
            {state.error} <Link href={DIALOGFLOW_CX_LEARN_MORE}>See documentation</Link>
          </span>
        </Box.Flex>
      );
    }
    if (state.verifiedAgent) {
      return (
        <Box.Flex my={12} color={ThemeColor.GREEN} fontSize={13}>
          <SvgIcon icon="checkSquare" marginRight={9} />
          <OverflowText>{state.verifiedAgent.displayName}</OverflowText>
        </Box.Flex>
      );
    }
    return null;
  };

  return (
    <>
      <Input
        autoFocus
        value={state.rawUrl}
        onChangeText={updateURL}
        placeholder="Dialogflow CX agent link"
        error={!!state.error}
        disabled={!hasGoogleAccount}
      />
      {InputInfo()}
      {(!waitOnAgent || !!state.verifiedAgent) && (
        <>
          <Divider isSecondaryColor offset={20} width="110%" />
          <RadioGroup column options={INTENT_OPTIONS} checked={state.intentUploadType} onChange={updateIntentUploadType} />
          {state.intentUploadType === INTENT_UPLOAD_TYPE.SELECT && (
            <Box mt={12}>
              <IntentsSelect value={selectedIntents} onChange={updateSelectedIntents} />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default AgentSettings;
