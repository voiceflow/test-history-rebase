import {
  ButtonVariant,
  COLOR_PICKER_CONSTANTS,
  ColorPicker,
  ColorThemes,
  stopPropagation,
  useDebouncedCallback,
  useLinkedState,
  usePersistFunction,
  useTeardown,
} from '@voiceflow/ui';
import React from 'react';

import * as CanvasTemplate from '@/ducks/canvasTemplate';
import * as ProjectV2 from '@/ducks/projectV2';
import { useEventualEngine, useSelector } from '@/hooks';
import type Engine from '@/pages/Canvas/engine';
import { isChipNode } from '@/utils/node';

import * as S from './styles';

export interface TemplateEditorProps {
  name?: string;
  color: string | null;
  nodeIDs: string[];
  editing?: boolean;
  isSubmitting?: boolean;
  onSubmit: (value: { name: string; color: string }) => void;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

const getDefaultColorScheme = (getEngine: () => Engine | null | undefined, nodeIDs: string[]) => {
  const engine = getEngine();

  if (!engine) return COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT;

  const node = engine?.getNodeByID(nodeIDs[0]) || engine.select(CanvasTemplate.nodeByIDSelector, { id: nodeIDs[0] });

  if (!node) return COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT;
  const [childNodeID] = node.combinedNodes;
  const childNode = engine?.getNodeByID(childNodeID) || engine.select(CanvasTemplate.nodeByIDSelector, { id: childNodeID });

  return isChipNode(childNode, node) ? COLOR_PICKER_CONSTANTS.ColorScheme.DARK : COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT;
};

const CanvasTemplateEditor: React.FC<TemplateEditorProps> = ({
  color,
  onColorChange,
  nodeIDs,
  editing = false,
  isSubmitting,
  onNameChange,
  name: oldName = '',
  onSubmit,
}) => {
  const getEngine = useEventualEngine();
  const customThemes = useSelector(ProjectV2.active.customThemesSelector);

  const debouncedOnNameChange = useDebouncedCallback(300, onNameChange);
  const normalizedColor = ColorPicker.useNormalizedColor(color || '');
  const [name, setName] = useLinkedState(oldName);

  const isValid = name.length > 0;

  const handleNameChange = usePersistFunction((newName) => {
    setName(newName);
    debouncedOnNameChange(newName);
  });

  const handleSubmit = usePersistFunction(() => {
    if (!isValid) return;
    onSubmit({ name, color: normalizedColor });
  });

  useTeardown(() => {
    if (editing) handleSubmit();
  }, [handleSubmit, editing]);

  const defaultColorScheme = getDefaultColorScheme(getEngine, nodeIDs);
  const colors = [COLOR_PICKER_CONSTANTS.DEFAULT_SCHEME_COLORS[defaultColorScheme], ...COLOR_PICKER_CONSTANTS.DEFAULT_THEMES, ...customThemes];

  return (
    <S.OuterPopperContent onClick={stopPropagation(null, true)}>
      <S.InnerPopperContent editing={editing}>
        <S.Input autoFocus autoSelectText value={name} placeholder="Template name" onChangeText={handleNameChange} onEnterPress={handleSubmit} />
        <S.Label>Block Color</S.Label>
        <ColorThemes colors={colors} selectedColor={normalizedColor} newColorIndex={undefined} onColorSelect={onColorChange} disableContextMenu />
      </S.InnerPopperContent>

      {!editing && (
        <div style={{ padding: '6px', width: '100%' }}>
          <S.Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit} disabled={!isValid || isSubmitting} isLoading={isSubmitting}>
            Create
          </S.Button>
        </div>
      )}
    </S.OuterPopperContent>
  );
};

export default CanvasTemplateEditor;
