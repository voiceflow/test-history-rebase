import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { DialogType, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from './constants';
import StyledSpeakAudioItem from './StyledSpeakAudioItem';

const SpeakEditor: NodeEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = ({ data, platform, onChange }) => {
  const {
    dialogs,
    randomize,
    canvasVisibility = randomize ? BaseNode.Utils.CanvasNodeVisibility.PREVIEW : BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS,
  } = data;
  const isDeprecated = !data.canvasVisibility;

  const isAudio = React.useMemo(() => dialogs[0]?.type === DialogType.AUDIO, []);

  const updateDialogs = React.useCallback((dialogs: Realtime.SpeakData[]) => onChange({ dialogs }), [onChange]);
  const updateCanvasVisibility = React.useCallback((value: BaseNode.Utils.CanvasNodeVisibility) => onChange({ canvasVisibility: value }), [onChange]);

  const canvasVisibilityOption = useCanvasVisibilityOption(canvasVisibility, updateCanvasVisibility);

  return (
    <SpeakAudioList
      renderMenu={isDeprecated ? undefined : () => <OverflowMenu placement="top" options={[canvasVisibilityOption]} />}
      getControlOptions={
        isDeprecated
          ? undefined
          : ({ addAudio, addVoice, isMaxReached }) => [
              {
                icon: NODE_CONFIG.getIcon!(isAudio ? AUDIO_MOCK_DATA : VOICE_MOCK_DATA),
                label: 'Add Variant',
                onClick: isAudio ? addAudio : addVoice,
                disabled: isMaxReached,
              },
            ]
      }
      items={dialogs}
      platform={platform}
      maxItems={MAX_SYSTEM_MESSAGES_COUNT}
      randomize={isDeprecated ? data.randomize : undefined}
      isDeprecated={isDeprecated}
      itemComponent={StyledSpeakAudioItem}
      onChangeItems={updateDialogs}
      onChangeRandomize={isDeprecated ? (randomize) => onChange({ randomize }) : undefined}
    />
  );
};

export default SpeakEditor;
