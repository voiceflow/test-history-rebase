import type { BaseUtils } from '@voiceflow/base-types';
import { BaseVersion } from '@voiceflow/base-types';
import { AIModel } from '@voiceflow/dtos';
import { Box, Button, Modal, System, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { AIPromptSettings } from '@/components/AI/AIPromptSettings/AIPromptSettings.component';
import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import PromptInput from '@/components/PromptInput';
import RadioGroup from '@/components/RadioGroup';
import { NO_MATCH_LEARN_MORE } from '@/constants/link.constant';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useHotkey, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

const DEFAULT_GENERATIVE_NO_MATCH: BaseUtils.ai.AIModelParams = {
  model: AIModel.GPT_3_5_TURBO as unknown as BaseUtils.ai.GPT_MODEL,
  system:
    'You are a helpful AI assistant, the user has asked you a question that you do not know how to answer, try to communicate that you do not know the answer.',
};

const OPTIONS = [
  {
    id: BaseVersion.GlobalNoMatchType.STATIC,
    label: 'Static',
  },
  {
    id: BaseVersion.GlobalNoMatchType.GENERATIVE,
    label: 'Generative',
  },
];

const GlobalNoMatchModal = manager.create(
  'GlobalNoMatchModal',
  () =>
    ({ api, type: modalType, opened, hidden, animated, closePrevented }) => {
      const [trackingEvents] = useTrackingEvents();
      const projectConfig = useActiveProjectTypeConfig();
      const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
      const globalNoMatch = useSelector(VersionV2.active.globalNoMatchSelector);
      const aiPlaygroundEnabled = useProjectAIPlayground();

      const patchSettings = useDispatch(VersionV2.patchSettings);

      const [type, setType] = React.useState(() =>
        !(aiPlaygroundEnabled && globalNoMatch?.type) ? BaseVersion.GlobalNoMatchType.STATIC : globalNoMatch.type
      );
      const [staticPrompt, setStaticPrompt] = React.useState(
        () =>
          (globalNoMatch?.type === BaseVersion.GlobalNoMatchType.STATIC && globalNoMatch?.prompt) ||
          projectConfig.utils.prompt.factory({
            defaultVoice,
            content: VoiceflowConstants.defaultMessages.globalNoMatch,
          })
      );
      const [generativePrompt, setGenerativePrompt] = React.useState<BaseUtils.ai.AIModelParams>(
        () =>
          (globalNoMatch?.type === BaseVersion.GlobalNoMatchType.GENERATIVE && globalNoMatch?.prompt) ||
          DEFAULT_GENERATIVE_NO_MATCH
      );

      const onSubmit: React.MouseEventHandler = async () => {
        try {
          api.preventClose();

          if (type === BaseVersion.GlobalNoMatchType.STATIC) {
            await patchSettings({ globalNoMatch: { type, prompt: staticPrompt } });
          } else if (type === BaseVersion.GlobalNoMatchType.GENERATIVE) {
            await patchSettings({ globalNoMatch: { type, prompt: generativePrompt } });
          }

          trackingEvents.trackNoMatchCreated({ creationType: Tracking.NoMatchCreationType.GLOBAL });

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
          toast.error('Failed to update Global No Match.');
        }
      };

      useHotkey(Hotkey.MODAL_CLOSE, api.onClose, { preventDefault: true });

      return (
        <Modal
          type={modalType}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          maxWidth={450}
        >
          <Modal.Header actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={api.onClose} />}>
            Global No Match
          </Modal.Header>

          {aiPlaygroundEnabled && (
            <Box mb={16} px={32}>
              <RadioGroup options={OPTIONS} checked={type} onChange={setType} />
            </Box>
          )}
          {type === BaseVersion.GlobalNoMatchType.STATIC ? (
            <Box p={32} pt={0}>
              <PromptInput value={staticPrompt} onChange={setStaticPrompt} />
            </Box>
          ) : (
            <Box pb={20}>
              <AIPromptSettings
                value={generativePrompt}
                onValueChange={(next) => setGenerativePrompt((prompt) => ({ ...prompt, ...next }))}
              />
            </Box>
          )}

          <Modal.Footer>
            <Box.FlexApart fullWidth>
              <System.Link.Anchor href={NO_MATCH_LEARN_MORE}>Learn More</System.Link.Anchor>
              <Button variant={Button.Variant.PRIMARY} disabled={closePrevented} squareRadius onClick={onSubmit}>
                Save
              </Button>
            </Box.FlexApart>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default GlobalNoMatchModal;
