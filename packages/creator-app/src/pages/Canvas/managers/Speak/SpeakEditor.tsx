import { CanvasNodeVisibility } from '@voiceflow/general-types';
import { Text } from '@voiceflow/ui';
import React from 'react';

import Checkbox, { CheckboxProps, CheckboxType } from '@/components/Checkbox';
import OverflowMenu from '@/components/OverflowMenu';
import { DialogType, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { NodeData, SpeakData } from '@/models';
import SpeakItemList from '@/pages/Canvas/components/SpeakAndAudioList';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { ConnectedProps } from '@/types';

import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from './constants';
import StyledSpeakItem from './StyledSpeakItem';

export const CheckboxOption: React.FC<CheckboxProps> = ({ children, ...props }) => (
  <Checkbox type={CheckboxType.RADIO} isFlat {...props}>
    <Text px={6}>{children}</Text>
  </Checkbox>
);

const SpeakEditor: NodeEditor<NodeData.Speak, SpeakEditorConnectedProps> = ({
  data,
  platform,
  onChange,
  saveSettings,
  defaultCanvasNodeVisibility,
}) => {
  const defaultCanvasVisibility = defaultCanvasNodeVisibility || CanvasNodeVisibility.PREVIEW;
  const { dialogs, randomize, canvasVisibility = randomize ? CanvasNodeVisibility.PREVIEW : CanvasNodeVisibility.ALL_VARIANTS } = data;
  const isDeprecated = !data.canvasVisibility;

  const isAudio = React.useMemo(() => dialogs[0]?.type === DialogType.AUDIO, []);

  const updateDialogs = React.useCallback((dialogs: SpeakData[]) => onChange({ dialogs }), [onChange]);
  const updateCanvasVisibility = React.useCallback((value: CanvasNodeVisibility) => onChange({ canvasVisibility: value }), [onChange]);

  const updateDefaultCanvasVisibility = React.useCallback((value: CanvasNodeVisibility) => {
    saveSettings({ defaultCanvasNodeVisibility: value });
  }, []);

  const previewOption = (
    <CheckboxOption checked={canvasVisibility === CanvasNodeVisibility.PREVIEW} onChange={() => updateCanvasVisibility(CanvasNodeVisibility.PREVIEW)}>
      Show preview
    </CheckboxOption>
  );
  const variantsOption = (
    <CheckboxOption
      checked={canvasVisibility === CanvasNodeVisibility.ALL_VARIANTS}
      onChange={() => updateCanvasVisibility(CanvasNodeVisibility.ALL_VARIANTS)}
    >
      Show all variants
    </CheckboxOption>
  );
  const defaultVisibilityOption = (
    <CheckboxOption
      type={CheckboxType.CHECKBOX}
      checked={defaultCanvasVisibility === canvasVisibility}
      onChange={() =>
        updateDefaultCanvasVisibility(
          defaultCanvasVisibility === CanvasNodeVisibility.PREVIEW ? CanvasNodeVisibility.ALL_VARIANTS : CanvasNodeVisibility.PREVIEW
        )
      }
    >
      Set as default
    </CheckboxOption>
  );

  return (
    <SpeakItemList
      renderMenu={
        isDeprecated
          ? undefined
          : () => (
              <OverflowMenu
                placement="top"
                options={[
                  {
                    label: 'Canvas Visibility',
                    options: [
                      { label: previewOption, disabled: true },
                      { label: variantsOption, disabled: true },
                      { label: 'divider', disabled: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
                      { label: defaultVisibilityOption, disabled: true, menuItemProps: { ending: true } },
                    ],
                    menuProps: { noBottomPadding: true },
                  },
                ]}
              />
            )
      }
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
      itemComponent={StyledSpeakItem}
      onChangeItems={updateDialogs}
      onChangeRandomize={isDeprecated ? (randomize) => onChange({ randomize }) : undefined}
    />
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  focusedNode: Creator.focusedNodeSelector,
  defaultCanvasNodeVisibility: Version.activeCanvasNodeVisibilitySelector,
};

const mapDispatchToProps = {
  saveSettings: Version.saveSettings,
};

type SpeakEditorConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SpeakEditor) as NodeEditor<NodeData.Speak>;
