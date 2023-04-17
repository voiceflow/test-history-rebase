import * as Realtime from '@voiceflow/realtime-sdk';
import { useCreateConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import SlateEditable, { SlateEditorAPI, useSetupSlateEditor } from '@/components/SlateEditable';
import { useSetup, useTeardown } from '@/hooks';
import { withEnterPress } from '@/utils/dom';

import { InternalLinkInstance } from '../types';
import { getPathPointsCenter } from '../utils';
import CaptionText, { MIN_HEIGHT, PLACEHOLDER_WIDTH } from './LinkCaptionText';

interface LinkCaptionInputProps {
  color: string;
  value?: string;
  instance: InternalLinkInstance;
  onChange: (caption: Realtime.LinkDataCaption | null) => Promise<void>;
  isLineActive: boolean;
  isHighlighted?: boolean;
  onToggleEditing: (value: unknown) => void;
}

const LinkCaptionInput: React.FC<LinkCaptionInputProps> = ({ color, value, instance, onChange, isLineActive, isHighlighted, onToggleEditing }) => {
  const editor = useSetupSlateEditor();
  const initialValue = useCreateConst(() => (value ? SlateEditorAPI.createTextState(value) : SlateEditorAPI.getEmptyState()));
  const [localValue, setLocalValue] = React.useState(initialValue);

  const center = instance.getCenter();
  const points = instance.getPoints();
  const captionRect = instance.getCaptionRect();

  const isEmpty = SlateEditorAPI.isNewState(localValue);

  const onSave = usePersistFunction(async () => {
    const newValue = SlateEditorAPI.serialize(localValue);

    if (!newValue) {
      await onChange(null);
    } else if (captionRect.current) {
      await onChange({ value: newValue, width: captionRect.current.width, height: captionRect.current.height });
    }
  });

  const onEnterPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.shiftKey) {
      event.preventDefault();
      onToggleEditing(false);
    }
  };

  useSetup(() => {
    SlateEditorAPI.focus(editor);
    SlateEditorAPI.setSelection(editor, SlateEditorAPI.fullRange(editor));
  });

  useTeardown(() => onSave());

  React.useLayoutEffect(() => {
    if (!points.current) return;

    if (!center.current) {
      center.current = getPathPointsCenter(points.current, { isStraight: instance.isStraight() });
    }

    if (!instance.captionContainerRef.current && !isEmpty) {
      return;
    }

    const width = instance.captionContainerRef.current?.clientWidth ?? PLACEHOLDER_WIDTH;
    const height = instance.captionContainerRef.current?.clientHeight ?? MIN_HEIGHT;

    captionRect.current = { x: center.current[0] - width / 2, y: center.current[1] - height / 2, width, height };

    instance.updateCaptionPosition();
    instance.settingsRef.current?.setPosition();
  }, [value, isEmpty, localValue]);

  return (
    <CaptionText color={color} isEmpty={isEmpty} isLineActive={isLineActive} isHighlighted={isHighlighted}>
      <SlateEditable
        value={localValue}
        editor={editor}
        onBlur={() => onToggleEditing(false)}
        onChange={setLocalValue}
        onKeyPress={withEnterPress(onEnterPress)}
        placeholder="Type something"
      />
    </CaptionText>
  );
};

export default LinkCaptionInput;
