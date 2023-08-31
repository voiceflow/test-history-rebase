import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Box, Label, Text } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as VersionV2 from '@/ducks/versionV2';
import { css, styled, transition } from '@/hocs/styled';
import { useDispatch } from '@/hooks';

const LocaleButton = styled.button<{ 'data-active': boolean }>`
  flex: 1 1 auto;
  width: 130px;
  margin: 4px;
  padding: 0.375rem 0.75rem;
  color: #62778c;
  font-weight: 600;
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #dfe3ed;
  border-radius: 5px;
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

const ORDERED_LOCALES = Utils.array.unique([
  ...Platform.Alexa.CONFIG.types.voice.project.locale.preferredLocales,
  ...Platform.Alexa.CONFIG.types.voice.project.locale.list,
]);

const LocalesForm: React.FC = () => {
  const locales = useSelector(VersionV2.active.localesSelector);
  const updateLocales = useDispatch(VersionV2.updateLocales);

  const toggleLocale = React.useCallback(
    (locale: string) => {
      const nextLocales = Utils.array.toggleMembership(locales, locale);

      if (nextLocales.length) {
        updateLocales(nextLocales);
      }
    },
    [locales]
  );

  return (
    <Box mb={24} maxWidth="627px">
      <Label>Location(s)</Label>
      <Box.Flex flexWrap="wrap" className="locale-button-group">
        {ORDERED_LOCALES.map((locale, index) => (
          <LocaleButton key={index} data-active={locales.includes(locale)} onClick={() => toggleLocale(locale)}>
            {Platform.Alexa.CONFIG.types.voice.project.locale.labelMap[locale]}
          </LocaleButton>
        ))}
      </Box.Flex>
    </Box>
  );
};

export default LocalesForm;

export const LocalesDescription: React.FC = () => (
  <Box mb={16}>
    <Text color="#8da2b5" fontSize={13}>
      <b>Locale</b> determines your skill's availability. Your skill will be available in the regions you select here.
    </Text>
  </Box>
);
