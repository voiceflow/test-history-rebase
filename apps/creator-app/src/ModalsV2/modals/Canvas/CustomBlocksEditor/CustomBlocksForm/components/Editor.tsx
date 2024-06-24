import { Input, Link, SectionV2, Text, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import AceEditor, { InputMode } from '@/components/AceEditor';
import DraggableList from '@/components/DraggableList';
import Checkbox from '@/components/legacy/Checkbox';
import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks/mapManager';
import THEME from '@/styles/theme';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import DraggableItem from './DraggableItem';
import ErrorText from './ErrorText';

export interface PathData {
  label: string;
  isDefault?: boolean;
}

export interface EditorProps {
  name: string;
  setName: (newName: string) => void;
  nameErrorMsg: string | null;

  paths: PathData[];
  setPaths: (newPaths: PathData[]) => void;

  stopOnBlock: boolean;
  toggleStopOnBlock: () => void;

  body: string;
  onBodyChange: (text: string) => void;

  placeholder?: string;
}

export const Editor: React.FC<EditorProps> = ({
  name,
  setName,
  nameErrorMsg,
  paths,
  setPaths,
  stopOnBlock,
  toggleStopOnBlock,
  body,
  onBodyChange,
}) => {
  const mapManager = useMapManager(paths, (paths) => setPaths(paths), {
    onAdd: (value) => setPaths([...paths, value]),
    factory: () => ({ label: '', isDefault: false }),
    onRemove: (_, index) => setPaths(paths.slice(0, index).concat(paths.slice(index + 1))),
  });

  return (
    <SectionV2>
      <SectionV2.CollapseSection
        header={
          <SectionV2.Header bottomUnit={1.25}>
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>
          </SectionV2.Header>
        }
        backgroundColor={THEME.colors.white}
      >
        <SectionV2.Content bottomOffset={3}>
          <Input
            value={name}
            onChangeText={setName}
            error={!!nameErrorMsg}
            fullWidth
            autoFocus
            placeholder="Custom block name"
            errorBorderColor={ThemeColor.ERROR}
          />
          <ErrorText errorMessage={nameErrorMsg} />
        </SectionV2.Content>
      </SectionV2.CollapseSection>

      <SectionV2.CollapseSection
        header={
          <SectionV2.Header topUnit={0} bottomUnit={1.25}>
            <SectionV2.Title bold secondary>
              Action Body
            </SectionV2.Title>

            <Link onClick={onOpenInternalURLInANewTabFactory(Documentation.MVP_CUSTOM_BLOCK_EXAMPLES)}>
              <Text fontSize={13}>See examples</Text>
            </Link>
          </SectionV2.Header>
        }
        backgroundColor={THEME.colors.white}
      >
        <SectionV2.Content style={{ marginBottom: '16px', paddingBottom: '0px' }}>
          <AceEditor
            inputMode={InputMode.INPUT}
            variant="default"
            placeholder="Enter action body payload"
            value={body}
            onChange={onBodyChange}
            hasBorder
            editorSpacing
            minLines={10}
            maxLines={20}
            scrollMargin={[12, 12, 0, 0]}
          />
        </SectionV2.Content>

        <SectionV2.Content bottomOffset={3}>
          <Checkbox checked={stopOnBlock} onChange={toggleStopOnBlock}>
            <Text color={THEME.colors.primary} fontWeight={400}>
              Wait for user input on this block
            </Text>
          </Checkbox>
        </SectionV2.Content>
      </SectionV2.CollapseSection>

      <SectionV2.Divider />

      <SectionV2.ActionListSection
        title={<SectionV2.Title bold>Paths</SectionV2.Title>}
        action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
        contentProps={{ bottomOffset: 2.5 }}
      >
        {!!paths.length && (
          <DraggableList
            type="cards-buttons-editor"
            mapManager={mapManager}
            itemComponent={DraggableItem}
            partialDragItem
            previewComponent={DraggableItem}
            itemProps={{
              onUpdate: (pathdata: PathData) => setPaths([...paths, pathdata]),
            }}
          />
        )}
      </SectionV2.ActionListSection>
    </SectionV2>
  );
};
