import React from 'react';

import { ALEXA_SLOT_PATTERN, CUSTOM_SLOT_PLACEHOLDER, GOOGLE_SLOT_PATTERN } from '../constants';

const BaseSlotOption = ({ data }) => {
  const isAlexa = ALEXA_SLOT_PATTERN.test(data.value);
  const isGoogle = GOOGLE_SLOT_PATTERN.test(data.value);
  const isGlobal = !isAlexa && !isGoogle;

  const isCustom = data.label === CUSTOM_SLOT_PLACEHOLDER;

  return (
    <>
      {!isCustom && (isAlexa || isGlobal) && <i className="fab fa-amazon align-self-center" />}
      {!isCustom && (isGoogle || isGlobal) && <i className="fab fa-google align-self-center" />}
    </>
  );
};

export default BaseSlotOption;
