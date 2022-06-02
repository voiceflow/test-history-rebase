import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import VariablesInput from '@/components/VariablesInput';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import IntentSection from './IntentSection';

type CardButton = Realtime.NodeData.CardV2.CardButton;
type Card = Realtime.NodeData.CardV2.Card;

type ButtonInfo = Partial<{ cardID: string; buttonID: string; buttonIndex: number; cardIndex: number; button: CardButton; card: Card }>;
const findButtonInfo = (cards: Card[], buttonID: string): ButtonInfo => {
  const result: ButtonInfo = { buttonID };
  let button = null;

  cards?.some((card, cardIndex) => {
    button = card.buttons.find((button, buttonIndex) => {
      const foundButton = button.id === buttonID;
      if (foundButton) {
        result.buttonIndex = buttonIndex;
      }
      return foundButton;
    });

    if (button) {
      result.cardIndex = cardIndex;
      result.cardID = card.id;
      result.button = button;
      result.card = card;
    }

    return button;
  });

  return result;
};

const CardV2ButtonsEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CardV2>();
  const params = useParams<{ buttonID: string }>();
  const { state } = useLocation<{ waitForData?: boolean }>();

  const { button, card, cardIndex, buttonIndex } = React.useMemo(
    () => findButtonInfo(editor.data.cards, params.buttonID),
    [editor.data.cards, params.buttonID]
  );

  const onChangeButton = (partialButton: Partial<CardButton>) => {
    if (!button || !card || cardIndex == null || buttonIndex == null) return;

    const buttons = Utils.array.replace(card.buttons, buttonIndex, { ...button, ...partialButton });

    const cards = Utils.array.replace(editor.data.cards, cardIndex, {
      ...card,
      buttons,
    });

    editor.onChange({ cards });
  };

  const shouldRedirect = !button && !state.waitForData;

  return shouldRedirect ? (
    <EditorV2.RedirectToRoot />
  ) : (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={editor.goBack} />}>
      {button && (
        <>
          <SectionV2.Content topOffset={2.5}>
            <FormControl>
              <VariablesInput
                value={button.name || ''}
                onBlur={({ text }) => onChangeButton({ name: text })}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                placeholder="Enter button label, { to add variable"
              />
            </FormControl>
          </SectionV2.Content>
          <SectionV2.Divider inset />
          <IntentSection intentID={button?.intent} buttonID={params.buttonID} onChange={(intent) => onChangeButton({ intent })} editor={editor} />
        </>
      )}
    </EditorV2>
  );
};

export default CardV2ButtonsEditor;
