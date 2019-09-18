import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import { DEFAULT_PHRASE, updateProduct } from '@/ducks/product';

import { Input, NextContainer, PhraseButton, PhraseSection } from './components';

function PhrasesForm({ product, locale, updateProduct, changeStep }) {
  const [editingPhrase, setEditingPhrase] = useState({ value: '', index: null });

  const onAdd = () => {
    updateProduct({
      ...product,
      locales: {
        ...product.locales,
        [locale]: {
          ...product.locales[locale],
          phrases: [DEFAULT_PHRASE, ...product.locales[locale].phrases],
        },
      },
    });
  };

  const onBlur = () => {
    updateProduct({
      ...product,
      locales: {
        ...product.locales,
        [locale]: {
          ...product.locales[locale],
          phrases: product.locales[locale].phrases.map((phrase, index) => (index === editingPhrase.index ? editingPhrase.value : phrase)),
        },
      },
    });
    setEditingPhrase({ value: '', index: null });
  };

  const onRemove = (index) => () => {
    const phrases = product.locales[locale].phrases.filter((_, idx) => index !== idx);

    updateProduct({
      ...product,
      locales: {
        ...product.locales,
        [locale]: {
          ...product.locales[locale],
          phrases: phrases.length === 0 ? [DEFAULT_PHRASE] : phrases,
        },
      },
    });
  };

  return (
    <>
      {product.locales[locale].phrases.map((phrase, index) => (
        <PhraseSection key={index}>
          <Input
            name="phrase"
            placeholder="Alexa, buy the cave quest expansion pack"
            value={editingPhrase.index === index ? editingPhrase.value : phrase}
            onFocus={() => setEditingPhrase({ value: phrase, index })}
            onChange={(e) => setEditingPhrase({ value: e.target.value, index })}
            onBlur={onBlur}
            onKeyPress={(e) => {
              if (e.charCode === 13) e.preventDefault();
            }}
          />
          <PhraseButton onClick={onRemove(index)} addPadding={index !== 0}>
            <SvgIcon icon="itemMinus" size={14} />
          </PhraseButton>
          {index === 0 && (
            <PhraseButton onClick={onAdd} disable={product.locales[locale].phrases.length > 2}>
              <SvgIcon icon="itemAdd" size={14} color="currentColor" />
            </PhraseButton>
          )}
        </PhraseSection>
      ))}
      <NextContainer>
        <Button variant="secondary" onClick={changeStep}>
          Next
        </Button>
      </NextContainer>
    </>
  );
}

PhrasesForm.proptypes = {
  product: PropTypes.object,
  locale: PropTypes.string,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapDispatchToProps = {
  updateProduct,
};

export default connect(
  null,
  mapDispatchToProps
)(PhrasesForm);
