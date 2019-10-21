import React from 'react';

import { ALEXA_INTENT_PATTERN, GOOGLE_INTENT_PATTERN } from '../constants';

const BaseIntentOption = ({ data }) => {
  const isAlexa = ALEXA_INTENT_PATTERN.test(data.value);
  const isGoogle = GOOGLE_INTENT_PATTERN.test(data.value);

  return (
    <>
      {isAlexa && <i className="fab fa-amazon align-self-center" />}
      {isGoogle && <i className="fab fa-google align-self-center" />}
    </>
  );
};

export default BaseIntentOption;
