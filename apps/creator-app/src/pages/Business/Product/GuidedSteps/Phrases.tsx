import { Button, ButtonVariant, Input, SvgIcon } from '@voiceflow/ui';
import React, { useState } from 'react';

import { DEFAULT_PRODUCT_PHRASE } from '@/constants';

import { ProductContext } from '../../contexts';
import { NextButtonContainer, PhraseButton, PhraseSection } from './components';

export interface PhrasesFormProps {
  advanceStep: VoidFunction;
}

const PhrasesForm: React.FC<PhrasesFormProps> = ({ advanceStep }) => {
  const [editingPhrase, setEditingPhrase] = useState<{ value: string; index: number | null }>({ value: '', index: null });
  const { product, patchProduct } = React.useContext(ProductContext)!;

  const onAdd = () => {
    patchProduct({
      phrases: [DEFAULT_PRODUCT_PHRASE, ...product.phrases],
    });
  };

  const onBlur = () => {
    patchProduct({
      phrases: product.phrases.map((phrase, index) => (index === editingPhrase.index ? editingPhrase.value : phrase)),
    });
    setEditingPhrase({ value: '', index: null });
  };

  const onRemove = (index: number) => () => {
    const phrases = product.phrases.filter((_, idx) => index !== idx);

    patchProduct({
      phrases: phrases.length === 0 ? [DEFAULT_PRODUCT_PHRASE] : phrases,
    });
  };

  return (
    <>
      {product.phrases.map((phrase, index) => (
        <PhraseSection key={index}>
          <Input
            name="phrase"
            value={editingPhrase.index === index ? editingPhrase.value : phrase}
            onBlur={onBlur}
            onFocus={() => setEditingPhrase({ value: phrase, index })}
            placeholder="Alexa, buy the cave quest expansion pack"
            onChangeText={(value) => setEditingPhrase({ value, index })}
            onEnterPress={(event) => event.preventDefault()}
          />

          <PhraseButton onClick={onRemove(index)} addPadding={index !== 0}>
            <SvgIcon icon="itemMinus" size={14} />
          </PhraseButton>

          {index === 0 && (
            <PhraseButton onClick={onAdd} disable={product.phrases.length > 2}>
              <SvgIcon icon="itemAdd" size={14} color="currentColor" />
            </PhraseButton>
          )}
        </PhraseSection>
      ))}

      <NextButtonContainer>
        <Button variant={ButtonVariant.SECONDARY} onClick={advanceStep}>
          Next
        </Button>
      </NextButtonContainer>
    </>
  );
};

export default PhrasesForm;
