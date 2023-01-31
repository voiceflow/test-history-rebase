import { preventDefault, SvgIconTypes, System } from '@voiceflow/ui';
import React from 'react';
import { Editor } from 'slate';
import { PickByValue } from 'utility-types';

import { ElementProperty, Hotkey, TextProperty } from '../constants';
import { useSlateEditor } from '../contexts';
import { EditorAPI, Element, Text } from '../editor';
import { useEditorHotkey } from '../hooks';
import IconButton from './IconButton';

// only boolean text property keys
type BooleanTextPropertyKey = keyof PickByValue<Pick<Text, TextProperty>, boolean | undefined>;

interface CreatePropertyButtonBaseOptions {
  icon: SvgIconTypes.Icon;
  hotkey?: Hotkey;
}

interface CreatePropertyButtonOptions extends CreatePropertyButtonBaseOptions {
  nullable?: boolean;
}

interface CreateElementPropertyButtonOptions<P extends ElementProperty> extends CreatePropertyButtonOptions {
  value: NonNullable<Element[P]>;
  property: P;
}

interface CreateTextPropertyButtonOptions<P extends TextProperty> extends CreatePropertyButtonOptions {
  value: NonNullable<Text[P]>;
  property: P;
  removable?: boolean;
}

interface CreateToggleTextPropertyButtonOptions<P extends BooleanTextPropertyKey> extends CreatePropertyButtonBaseOptions {
  property: P;
}

interface CreateButtonOptions {
  icon: SvgIconTypes.Icon;
  hotkey?: Hotkey;
  onAction: (editor: Editor, active: boolean) => void;
  isActive: (editor: Editor) => boolean;
}

type PropertyButton = React.FC<{ component?: React.FC<System.IconButton.I.Props>; icon?: SvgIconTypes.Icon }>;

const createButton =
  ({ icon: defaultIcon, hotkey, isActive, onAction }: CreateButtonOptions): PropertyButton =>
  ({ component: Component, icon = defaultIcon }) => {
    const editor = useSlateEditor();

    const active = isActive(editor);

    useEditorHotkey(hotkey ?? Hotkey.NOOP, () => {
      if (hotkey) {
        onAction(editor, active);
      }
    });

    if (Component) return <Component icon={icon} active={active} onMouseDown={preventDefault(() => onAction(editor, active))} />;

    return <IconButton icon={icon} active={active} onMouseDown={preventDefault(() => onAction(editor, active))} />;
  };

export const createElementPropertyButton = <P extends ElementProperty>({
  value,
  property,
  nullable,
  ...options
}: CreateElementPropertyButtonOptions<P>): PropertyButton =>
  createButton({
    ...options,
    isActive: (editor) => EditorAPI.isElementPropertyActive(editor, property, value, { nullable }),
    onAction: (editor) => EditorAPI.setElementProperty(editor, property, value),
  });

export const createTextPropertyButton = <P extends TextProperty>({
  value,
  property,
  nullable,
  removable,
  ...options
}: CreateTextPropertyButtonOptions<P>): PropertyButton =>
  createButton({
    ...options,
    isActive: (editor) => EditorAPI.isTextPropertyActive(editor, property, value, { nullable }),
    onAction: (editor, active) => EditorAPI.setTextProperty(editor, property, active && removable ? undefined : value),
  });

export const createToggleTextPropertyButton = <P extends BooleanTextPropertyKey>({
  property,
  ...options
}: CreateToggleTextPropertyButtonOptions<P>): PropertyButton =>
  createButton({
    ...options,
    isActive: (editor) => EditorAPI.isTextPropertyActive<P>(editor, property, true as NonNullable<Text[P]>),
    onAction: (editor, active) => EditorAPI.toggleTextProperty(editor, property, !active),
  });
