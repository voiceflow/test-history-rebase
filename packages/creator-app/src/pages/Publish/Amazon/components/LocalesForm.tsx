import { Constants } from '@voiceflow/alexa-types';
import { Box, BoxFlex, Label } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as Version from '@/ducks/version';
import { css, styled, transition } from '@/hocs';
import { useDispatch } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { toggleMembership } from '@/utils/array';

const LocaleButton = styled.button<{ 'data-active': boolean }>`
  width: 130px;
  margin: 4px;
  background-color: #fff;
  border-radius: 5px;
  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid #dfe3ed;
  padding: 0.375rem 0.75rem;
  flex: 1 1 auto;
  ${transition()};

  ${(props) =>
    props['data-active'] &&
    css`
      color: #132144;
      background: linear-gradient(#eff5f6, #eef4f6), #fff;
    `}

  :hover {
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85), #eef4f6), #fff;
  }

  :active {
    color: #132144;
    background: linear-gradient(180deg, rgba(238, 244, 246, 0.85), #eef4f6), #fff;
  }
`;

const LocalesForm: React.FC = () => {
  const locales = useSelector(Version.alexa.activeLocalesSelector);
  const saveLocales = useDispatch(Version.saveLocales);

  const toggleLocale = React.useCallback(
    (locale: Constants.Locale) => {
      const nextLocales = toggleMembership(locales, locale);

      if (nextLocales.length) {
        saveLocales(nextLocales);
      }
    },
    [locales]
  );

  return (
    <Box className="pa__locale-limited" mb={24}>
      <Label>Location(s)</Label>
      <BoxFlex flexWrap="wrap" className="locale-button-group">
        {LOCALE_MAP.map((locale, index) => (
          <LocaleButton data-active={locales.includes(locale.value)} key={index} onClick={() => toggleLocale(locale.value)}>
            {locale.name}
          </LocaleButton>
        ))}
      </BoxFlex>
    </Box>
  );
};

export default LocalesForm;

export const LocalesDescription: React.FC = () => (
  <div className="publish-info">
    <p className="helper-text">
      <b>Locale</b> determines your skill's availability. Your skill will be available in the regions you select here.
    </p>
  </div>
);
