import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, createDividerMenuItemOption, SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import VariableSelectV2 from '@/components/VariableSelectV2';
import * as Documentation from '@/config/documentation';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useAddSlot, useSelector, useVariableCreation } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { Actions, NoReplyV2 } from '../../components';
import { ENTIRE_USER_REPLY_ID, ENTIRE_USER_REPLY_LABEL } from './constants';
import EntitySelector from './EntitySelector';
import { useEntitiesOptions } from './hooks';

const QueryEditor: React.FC<{ disableAnimation: boolean }> = ({ disableAnimation }) => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>();
  const projectConfig = useActiveProjectTypeConfig();

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
  const { variables, createVariable } = useVariableCreation();

  const options = useEntitiesOptions(allSlots);

  const { onAddSlot } = useAddSlot();

  const onSelect = (slotID: string | null) => {
    if (!slotID || slotID === ENTIRE_USER_REPLY_ID) return;

    editor.onChange({
      intent: { slots: [projectConfig.utils.intent.slotFactory({ id: slotID })] },
      noMatch: getPlatformNoMatchFactory(editor.projectType)({ defaultVoice }),
      captureType: BaseNode.CaptureV2.CaptureType.INTENT,
    });
  };

  const onCreate = async (value = '') => {
    const slot = await onAddSlot(value === ENTIRE_USER_REPLY_LABEL ? '' : value);

    onSelect(slot?.id ?? null);
  };

  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });
  const intentScopeOption = useIntentScope({ data: editor.data, onChange: editor.onChange });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.CAPTURE_STEP}>
          <EditorV2.FooterActionsButton actions={[intentScopeOption, createDividerMenuItemOption(), noReplyConfig.option]} />
        </EditorV2.DefaultFooter>
      }
      dropLagAccept={Actions.Section.DRAG_TYPE}
      disableAnimation={disableAnimation}
    >
      <EditorV2.PersistCollapse namespace={['CaptureSection', ENTIRE_USER_REPLY_ID]} defaultCollapsed={false}>
        {({ collapsed, onToggle }) => (
          <SectionV2.Sticky disabled={collapsed}>
            {({ sticked }) => (
              <SectionV2.CollapseSection
                header={
                  <SectionV2.Header sticky sticked={sticked && !collapsed}>
                    <SectionV2.Title bold={!collapsed}>Capture user reply</SectionV2.Title>

                    <SectionV2.CollapseArrowIcon collapsed={collapsed} />
                  </SectionV2.Header>
                }
                onToggle={onToggle}
                collapsed={collapsed}
                containerToggle
              >
                <SectionV2.Content bottomOffset={2.5}>
                  <EntitySelector value={ENTIRE_USER_REPLY_ID} options={options} onCreate={onCreate} onSelect={onSelect} />

                  <Box mt={16}>
                    <VariableSelectV2
                      value={editor.data.variable}
                      prefix={<SvgIcon icon="setV2" color="#6e849ad9" />}
                      options={variables}
                      onCreate={createVariable}
                      onChange={(variable) => editor.onChange({ variable })}
                    />
                  </Box>
                </SectionV2.Content>
              </SectionV2.CollapseSection>
            )}
          </SectionV2.Sticky>
        )}
      </EditorV2.PersistCollapse>

      <SectionV2.Divider />

      <Actions.Section portID={editor.node.ports.out.builtIn[BaseModels.PortType.NEXT]} editor={editor} />

      {noReplyConfig.section}
    </EditorV2>
  );
};

export default QueryEditor;
