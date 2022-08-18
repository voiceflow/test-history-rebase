import {
  ButtonVariant,
  COLOR_PICKER_CONSTANTS,
  ColorThemes,
  normalizeColor,
  stopPropagation,
  toast,
  useDebouncedCallback,
  useLinkedState,
} from '@voiceflow/ui';
import React from 'react';

import * as CanvasTemplate from '@/ducks/canvasTemplate';
import * as Diagram from '@/ducks/diagram';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector, useTeardown } from '@/hooks';

import * as S from '../styles';
import { TemplatePopperContentProps } from '../types';

const TemplateLibraryPopperContent: React.FC<TemplatePopperContentProps> = ({
  selectedColor,
  onColorChange,
  defaultColorScheme = COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT,
  nodeIDs,
  editing = false,
  onNameChange,
  oldName = '',
}) => {
  const createCanvasTemplate = useDispatch(CanvasTemplate.createCanvasTemplate);
  const templateDiagramID = useSelector(VersionV2.active.templateDiagramIDSelector);
  const createTemplateDiagram = useDispatch(Diagram.createTemplateDiagram);
  const customThemes = useSelector(ProjectV2.active.customThemesSelector);
  const colors = [COLOR_PICKER_CONSTANTS.DEFAULT_SCHEME_COLORS[defaultColorScheme], ...COLOR_PICKER_CONSTANTS.DEFAULT_THEMES, ...customThemes];
  const normalizedColor = React.useMemo(() => normalizeColor(selectedColor), [selectedColor]);
  const [selectedHex, setSelectedHex] = useLinkedState(normalizedColor);
  const [name, setName] = React.useState<string>(oldName);

  const debouncedOnColorChange = useDebouncedCallback(100, (color: string) => onColorChange(color), []);
  const onChangeHex = (hex: string) => {
    setSelectedHex(hex);
    if (editing) debouncedOnColorChange(hex);
  };

  const onCreateTemplate = async () => {
    try {
      if (!templateDiagramID) {
        await createTemplateDiagram();
      }

      await createCanvasTemplate({ name, color: selectedHex, nodeIDs });

      // TODO: copy node/nodeData to template diagram

      toast.success(`Block template saved to library.`);
    } catch {
      toast.error('Something went wrong, please contact support if this issue persists.');
    }
  };

  useTeardown(() => {
    if (editing && onNameChange) onNameChange(name);
  }, [onNameChange, name]);

  return (
    <S.OuterPopperContent>
      <S.InnerPopperContent onClick={stopPropagation(null, true)}>
        <S.StyledInput
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          autoSelectText
          value={name}
          placeholder="Template Name"
          onChangeText={setName}
        />
        <S.Label>Block Color</S.Label>
        <ColorThemes colors={colors} selectedColor={selectedHex} newColorIndex={undefined} onColorSelect={onChangeHex} />
      </S.InnerPopperContent>

      {!editing && (
        <S.StyledButton variant={ButtonVariant.PRIMARY} onClick={onCreateTemplate} disabled={name.length === 0}>
          Create
        </S.StyledButton>
      )}
    </S.OuterPopperContent>
  );
};

export default TemplateLibraryPopperContent;
