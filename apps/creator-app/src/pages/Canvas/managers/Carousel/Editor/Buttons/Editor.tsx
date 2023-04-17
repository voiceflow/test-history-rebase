import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import VariablesInput, { VariablesInputRef } from '@/components/VariablesInput';
import { useFeature, useSetup } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../../components';
import IntentSection from './IntentSection';

type ButtonInfo = Partial<{
  cardID: string;
  buttonID: string;
  buttonIndex: number;
  cardIndex: number;
  button: Realtime.NodeData.Carousel.Button;
  card: Realtime.NodeData.Carousel.Card;
}>;

const findButtonInfo = (cards: Realtime.NodeData.Carousel.Card[], buttonID: string): ButtonInfo => {
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

const CarouselButtonsEditor: React.FC = () => {
  const inputRef = React.useRef<VariablesInputRef>(null);
  const chatCarouselIntent = useFeature(Realtime.FeatureFlag.CHAT_CAROUSEL_INTENT);
  const editor = EditorV2.useEditor<Realtime.NodeData.Carousel>();
  const params = useParams<{ buttonID: string }>();
  const { state } = useLocation<{ waitForData?: boolean; renaming?: boolean }>();

  const { button, card, cardIndex, buttonIndex } = React.useMemo(
    () => findButtonInfo(editor.data.cards, params.buttonID),
    [editor.data.cards, params.buttonID]
  );

  const onChangeButton = (partialButton: Partial<Realtime.NodeData.Carousel.Button>) => {
    if (!button || !card || cardIndex == null || buttonIndex == null) return;

    const buttons = Utils.array.replace(card.buttons, buttonIndex, { ...button, ...partialButton });

    const cards = Utils.array.replace(editor.data.cards, cardIndex, {
      ...card,
      buttons,
    });

    editor.onChange({ cards });
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
                autoFocus
              />
            </FormControl>
          </SectionV2.Content>

          {chatCarouselIntent.isEnabled && (
            <>
              <SectionV2.Divider inset />
              <IntentSection intentID={button?.intent} buttonID={params.buttonID} onChange={(intent) => onChangeButton({ intent })} editor={editor} />
            </>
          )}

          <SectionV2.Divider inset />

          <Actions.Section portID={editor.node.ports.out.byKey[button.id]} editor={editor} />
          <SectionV2.Divider />
        </>
      )}
    </EditorV2>
  );
};

export default CarouselButtonsEditor;
