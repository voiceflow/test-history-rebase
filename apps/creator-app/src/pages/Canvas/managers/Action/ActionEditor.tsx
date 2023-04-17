import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input, OptionsMenuOption, SectionV2, TippyTooltip, Toggle, useLinkedState, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';
import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';
import THEME from '@/styles/theme';

import { Path } from './components';

const SHOW_ACTION_BODY_KEY = 'Action/constants:SHOW_ACTION_BODY';

const ActionEditor: NodeEditorV2<Realtime.NodeData.Trace> = ({ data, node, engine, onChange }) => {
  const [name, setName] = useLinkedState(data.name);
  const [value, setValue] = useLinkedState(data.body);

  const [showActionBody, setShowActionBody] = useLocalStorageState(SHOW_ACTION_BODY_KEY, !!value);

  const toggleIsBlocking = React.useCallback(() => onChange({ isBlocking: !data.isBlocking }), [data.isBlocking, onChange]);

  const mapManager = useMapManager(data.paths, (paths) => onChange({ paths }), {
    onAdd: () => engine.port.addDynamic(node.id),
    factory: () => ({ label: '', isDefault: false }),
    onRemove: (_, index) => engine.port.removeDynamic(node.ports.out.dynamic[index]),
  });

  const updateDefaultPath = (i: number) => {
    mapManager.map((item, { index, onUpdate }) => {
      onUpdate({ ...item, isDefault: i === index });
      return null;
    });
  };

  const actionFooterOptions = React.useMemo<OptionsMenuOption[]>(
    () => [
      {
        label: showActionBody ? 'Remove Action Body' : 'Show Action Body',
        onClick: () => {
          if (showActionBody) {
            onChange({ body: '' });
          }
          setShowActionBody(!showActionBody);
        },
      },
    ],
    [showActionBody]
  );

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Custom Action" />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.BUTTONS_STEP}>
          <EditorV2.FooterActionsButton actions={actionFooterOptions} />
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection>
        <Input
          icon="action"
          value={name}
          onBlur={() => onChange({ name })}
          iconProps={{ color: THEME.buttonIconColors.default }}
          placeholder="Custom Action name"
          onChangeText={(value) => setName(value)}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      {(showActionBody || value) && (
        <>
          <SectionV2.CollapseSection
            defaultCollapsed
            header={({ collapsed, onToggle }) => (
              <SectionV2.Header onClick={onToggle} sticky>
                <SectionV2.Title bold={!collapsed}>Action Body</SectionV2.Title>
                <SectionV2.CollapseArrowIcon collapsed={collapsed} />
              </SectionV2.Header>
            )}
          >
            <SectionV2.Content bottomOffset={3}>
              <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onChange({ body: value })}
                minRows={3}
                placeholder="Add payload"
              />
            </SectionV2.Content>
          </SectionV2.CollapseSection>
          <SectionV2.Divider />
        </>
      )}

      <SectionV2.Sticky>
        {({ sticked }) => (
          <SectionV2.Header sticky sticked={sticked}>
            <SectionV2.Title bold>Paths</SectionV2.Title>
            <SectionV2.AddButton onClick={mapManager.onAdd} />
          </SectionV2.Header>
        )}
      </SectionV2.Sticky>
      <SectionV2.Content bottomOffset={0.5}>
        {mapManager.map((item, { index, key, isLast, onUpdate, onRemove }) => (
          <Box key={key} pb={isLast ? 16 : 12}>
            <Path
              path={item}
              index={index}
              onUpdate={onUpdate}
              onRemove={onRemove}
              updateDefaultPath={updateDefaultPath}
              removeDisabled={mapManager.size <= 1}
            />
          </Box>
        ))}
      </SectionV2.Content>
      <SectionV2.Divider />
      <TippyTooltip
        width={208}
        content={
          <TippyTooltip.Multiline>If checked, we will stop the conversation on this block until an interact action is sent.</TippyTooltip.Multiline>
        }
        display="block"
        offset={[0, -10]}
        position="bottom-end"
      >
        <SectionV2.SimpleSection onClick={toggleIsBlocking}>
          <SectionV2.Title>Stop on action</SectionV2.Title>

          <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!data.isBlocking} />
        </SectionV2.SimpleSection>
      </TippyTooltip>
    </EditorV2>
  );
};

export default ActionEditor;
