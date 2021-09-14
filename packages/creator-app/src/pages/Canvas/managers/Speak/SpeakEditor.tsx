import { Node } from '@voiceflow/base-types';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { DialogType, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as ProjectV2 from '@/ducks/projectV2';
import { connect } from '@/hocs';
import { NodeData, SpeakData } from '@/models';
import SpeakItemList from '@/pages/Canvas/components/SpeakAudioList';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { ConnectedProps } from '@/types';

import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from './constants';
import StyledSpeakAudioItem from './StyledSpeakAudioItem';

const SpeakEditor: NodeEditor<NodeData.Speak, SpeakEditorConnectedProps> = ({ data, platform, onChange }) => {
  const {
    dialogs,
    randomize,
    canvasVisibility = randomize ? Node.Utils.CanvasNodeVisibility.PREVIEW : Node.Utils.CanvasNodeVisibility.ALL_VARIANTS,
  } = data;
  const isDeprecated = !data.canvasVisibility;

  const isAudio = React.useMemo(() => dialogs[0]?.type === DialogType.AUDIO, []);

  const updateDialogs = React.useCallback((dialogs: SpeakData[]) => onChange({ dialogs }), [onChange]);
  const updateCanvasVisibility = React.useCallback((value: Node.Utils.CanvasNodeVisibility) => onChange({ canvasVisibility: value }), [onChange]);

  const canvasVisibilityOption = useCanvasVisibilityOption(canvasVisibility, updateCanvasVisibility);

  return (
    <SpeakItemList
      renderMenu={isDeprecated ? undefined : () => <OverflowMenu placement="top" options={[canvasVisibilityOption]} />}
      getControlOptions={
        isDeprecated
          ? undefined
          : ({ addAudio, addVoice, isMaxMatches }) => [
              {
                icon: NODE_CONFIG.getIcon!(isAudio ? AUDIO_MOCK_DATA : VOICE_MOCK_DATA),
                label: 'Add Variant',
                onClick: isAudio ? addAudio : addVoice,
                disabled: isMaxMatches,
                iconProps: { color: NODE_CONFIG.getIconColor!(isAudio ? AUDIO_MOCK_DATA : VOICE_MOCK_DATA) },
              },
            ]
      }
      items={dialogs}
      platform={platform}
      maxItems={MAX_SPEAK_ITEMS_COUNT}
      randomize={isDeprecated ? data.randomize : undefined}
      isDeprecated={isDeprecated}
      itemComponent={StyledSpeakAudioItem}
      onChangeItems={updateDialogs}
      onChangeRandomize={isDeprecated ? (randomize) => onChange({ randomize }) : undefined}
    />
  );
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  focusedNode: Creator.focusedNodeSelector,
};

type SpeakEditorConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(SpeakEditor) as NodeEditor<NodeData.Speak>;
