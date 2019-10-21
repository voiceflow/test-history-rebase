/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import Input from '@/componentsV2/Input';
import { DEFAULT_PRODUCT_PHRASE } from '@/constants';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { connect } from '@/hocs';

import { NextButtonContainer, PhraseButton, PhraseSection } from './components';

function PhrasesForm({ product, updateProduct, changeStep }) {
  const [editingPhrase, setEditingPhrase] = useState({ value: '', index: null });

  const onAdd = () => {
    updateProduct({
      ...product,
      phrases: [DEFAULT_PRODUCT_PHRASE, ...product.phrases],
    });
  };

  const onBlur = () => {
    updateProduct({
      ...product,
      phrases: product.phrases.map((phrase, index) => (index === editingPhrase.index ? editingPhrase.value : phrase)),
    });
    setEditingPhrase({ value: '', index: null });
  };

  const onRemove = (index) => () => {
    const phrases = product.phrases.filter((_, idx) => index !== idx);

    updateProduct({
      ...product,
      phrases: phrases.length === 0 ? [DEFAULT_PRODUCT_PHRASE] : phrases,
    });
  };

  return (
    <>
      {product.phrases.map((phrase, index) => (
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
            <PhraseButton onClick={onAdd} disable={product.phrases.length > 2}>
              <SvgIcon icon="itemAdd" size={14} color="currentColor" />
            </PhraseButton>
          )}
        </PhraseSection>
      ))}

      <NextButtonContainer>
        <Button variant="secondary" onClick={changeStep}>
          Next
        </Button>
      </NextButtonContainer>
    </>
  );
}

PhrasesForm.proptypes = {
  product: PropTypes.object,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapStateToProps = {
  product: productByIDSelector,
};

const mapDispatchToProps = {
  updateProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (product) => updateProduct(productID, product),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PhrasesForm);
