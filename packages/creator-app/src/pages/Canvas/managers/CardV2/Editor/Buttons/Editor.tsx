import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import VariablesInput, { VariablesInputRef } from '@/components/VariablesInput';
import { useSetup } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

type ButtonInfo = Partial<{
  cardID: string;
  buttonID: string;
  buttonIndex: number;
  cardIndex: number;
  button: Realtime.NodeData.CardV2.Button;
  card: Realtime.NodeData.CardV2.Card;
}>;

const findButtonInfo = (card: Realtime.NodeData.CardV2.Card, buttonID: string): ButtonInfo => {
  const result: ButtonInfo = { buttonID };
  const button = card.buttons.find((button, buttonIndex) => {
    const foundButton = button.id === buttonID;
    if (foundButton) {
      result.buttonIndex = buttonIndex;
    }
    return foundButton;
  });

  if (button) {
    result.cardID = card.id;
    result.button = button;
    result.card = card;
  }

  return result;
};

const CardV2ButtonsEditor: React.FC = () => {
  const inputRef = React.useRef<VariablesInputRef>(null);
  const editor = EditorV2.useEditor<Realtime.NodeData.CardV2>();
  const params = useParams<{ buttonID: string }>();
  const { state } = useLocation<{ waitForData?: boolean; renaming?: boolean }>();

  const { button, card, buttonIndex } = React.useMemo(() => findButtonInfo(editor.data.card, params.buttonID), [editor.data.card, params.buttonID]);

  const onChangeButton = (partialButton: Partial<Realtime.NodeData.CardV2.Button>) => {
    if (!button || !card || buttonIndex == null) return;

    const buttons = Utils.array.replace(card.buttons, buttonIndex, { ...button, ...partialButton });

    const populatedCard = {
      ...editor.data.card,
      buttons,
    };

    editor.onChange({ card: populatedCard });
  };

  useSetup(() => state.renaming && inputRef.current?.select());

  const shouldRedirect = !button && !state.waitForData;

  return shouldRedirect ? (
    <EditorV2.RedirectToRoot />
  ) : (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={editor.goBack} />}>
      {button && (
        <>
          <SectionV2.Content topOffset={2.5} bottomOffset={0.5}>
            <FormControl>
              <VariablesInput
                ref={inputRef}
                value={button.name || ''}
                onBlur={({ text }) => onChangeButton({ name: text })}
                placeholder="Enter button label, { to add variable"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </FormControl>
          </SectionV2.Content>
          <SectionV2.Divider />
          {/* {chatCardV2Intent.isEnabled && (
            <IntentSection intentID={button?.intent} buttonID={params.buttonID} onChange={(intent) => onChangeButton({ intent })} editor={editor} />
          )} */}
        </>
      )}
    </EditorV2>
  );
};

export default CardV2ButtonsEditor;
