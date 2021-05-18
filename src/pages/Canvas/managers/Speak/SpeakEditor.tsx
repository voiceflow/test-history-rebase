import { CanvasNodeVisibility } from '@voiceflow/general-types';
import React from 'react';

import Checkbox, { CheckboxType } from '@/components/Checkbox';
import NestedMenu from '@/components/NestedMenu';
import OverflowMenu from '@/components/OverflowMenu';
import Text from '@/components/Text';
import { DialogType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { NodeData, SpeakData } from '@/models';
import SpeakItemList from '@/pages/Canvas/components/SpeakAndAudioList';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { ConnectedProps, MenuOption } from '@/types';

import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from './constants';
import StyledSpeakItem from './StyledSpeakItem';

const NestedMenuAny: React.FC<any> = NestedMenu;
const MAX_EXPRESSIONS = 22;

type NestedMenuOption = MenuOption & { disabled?: boolean; menuItemProps?: {} };
type TopMenuOption = MenuOption & { options?: NestedMenuOption[]; menuProps?: {} };

const OPTIONS: TopMenuOption[] = [
  {
    label: 'Canvas Visibility',
    value: 'canvas-visibility',
    options: [
      { label: 'Show preview', value: CanvasNodeVisibility.PREVIEW, disabled: true },
      { label: 'Show all variants', value: CanvasNodeVisibility.ALL_VARIANTS, disabled: true },
      { label: 'divider', value: 'divider', disabled: true, menuItemProps: { style: { marginBottom: 0 }, divider: true } },
      { label: 'Set as default', value: 'ending', disabled: true, menuItemProps: { ending: true } },
    ],
    menuProps: { noBottomPadding: true },
  },
];

const SpeakEditor: NodeEditor<NodeData.Speak, SpeakEditorConnectedProps> = ({
  data,
  platform,
  onChange,
  saveSettings,
  updateSettings,
  defaultCanvasNodeVisibility,
}) => {
  const defaultCanvasVisibility = defaultCanvasNodeVisibility || CanvasNodeVisibility.PREVIEW;
  const { dialogs, randomize, canvasVisibility = randomize ? CanvasNodeVisibility.PREVIEW : CanvasNodeVisibility.ALL_VARIANTS } = data;
  const isDeprecated = !data.canvasVisibility;

  const isAudio = React.useMemo(() => dialogs[0]?.type === DialogType.AUDIO, []);

  const updateDialogs = React.useCallback((dialogs: SpeakData[]) => onChange({ dialogs }), [onChange]);
  const updateCanvasVisibility = React.useCallback((value: CanvasNodeVisibility) => onChange({ canvasVisibility: value }), [onChange]);

  const updateDefaultCanvasVisibility = React.useCallback((value: CanvasNodeVisibility) => {
    updateSettings({ defaultCanvasNodeVisibility: value });
    saveSettings({ settings: { defaultCanvasNodeVisibility: value } }, ['defaultCanvasNodeVisibility']);
  }, []);

  const getOptionValue = (option?: MenuOption) => option?.value;

  const getOptionLabel = (selectedValue: string) => {
    const flattenedOptions = OPTIONS!.flatMap(({ label, value, options = [] }) => [{ value, label }, ...options.flatMap((option) => [option])]);

    const option = flattenedOptions.find((option) => option.value === selectedValue);
    return option?.label;
  };

  return (
    <SpeakItemList
      renderMenu={
        isDeprecated
          ? undefined
          : () => (
              <OverflowMenu
                placement="top"
                menu={
                  <NestedMenuAny
                    options={OPTIONS}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    renderOptionLabel={(option: TopMenuOption | NestedMenuOption) => {
                      if ('options' in option) {
                        return option.label;
                      }

                      const isEnding = option.value === 'ending';

                      return (
                        <Checkbox
                          type={isEnding ? CheckboxType.CHECKBOX : CheckboxType.RADIO}
                          checked={isEnding ? defaultCanvasVisibility === canvasVisibility : canvasVisibility === option.value}
                          isFlat
                          onChange={
                            isEnding
                              ? () =>
                                  updateDefaultCanvasVisibility(
                                    defaultCanvasVisibility === CanvasNodeVisibility.PREVIEW
                                      ? CanvasNodeVisibility.ALL_VARIANTS
                                      : CanvasNodeVisibility.PREVIEW
                                  )
                              : () => updateCanvasVisibility(option.value)
                          }
                        >
                          <Text pl={6}>{option.label}</Text>
                        </Checkbox>
                      );
                    }}
                  />
                }
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
      maxItems={MAX_EXPRESSIONS}
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
  defaultCanvasNodeVisibility: Skill.defaultCanvasNodeVisibilitySelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  updateSettings: Skill.updateSettings,
};

type SpeakEditorConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(SpeakEditor) as NodeEditor<NodeData.Speak>;
