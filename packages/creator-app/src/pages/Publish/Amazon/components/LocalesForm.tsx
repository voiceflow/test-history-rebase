import { Locale } from '@voiceflow/alexa-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup, FormGroup, Label } from 'reactstrap';

import * as Version from '@/ducks/version';
import { useDispatch } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { toggleMembership } from '@/utils/array';

const LocalesForm: React.FC = () => {
  const locales = useSelector(Version.alexa.activeLocalesSelector);
  const saveLocales = useDispatch(Version.saveLocales);

  const toggleLocale = React.useCallback(
    (locale: Locale) => {
      const nextLocales = toggleMembership(locales, locale);

      if (nextLocales.length) {
        saveLocales(nextLocales);
      }
    },
    [locales]
  );

  return (
    <FormGroup className="mb-4 pa__locale-limited">
      <Label className="publish-label">Location(s)</Label>
      <ButtonGroup className="locale-button-group">
        {LOCALE_MAP.map((locale, index) => {
          const active = locales.includes(locale.value) ? 'active' : '';

          return (
            <Button outline color="primary" className={`locale-button ${active}`} key={index} onClick={() => toggleLocale(locale.value)}>
              {locale.name}
            </Button>
          );
        })}
      </ButtonGroup>
    </FormGroup>
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
