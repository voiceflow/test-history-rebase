import { Box, SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { copyWithToast } from '@/utils/clipboard';

import * as S from '../../../styles';
import { INPUT_WIDTH } from '../constants';

const VoiceflowFields: React.FC<{ acsURL: string; entityID: string }> = ({ acsURL, entityID }) => {
  return (
    <Page.Section
      mb={24}
      header={
        <Page.Section.Header>
          <Page.Section.Title>SAML SSO</Page.Section.Title>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection>
        <Box.FlexAlignStart fullWidth>
          <Box.FlexAlignStart width={INPUT_WIDTH} flexDirection="column">
            <Box mb={10}>
              <SectionV2.Title bold secondary>
                Audience URI (SP Entity ID)
              </SectionV2.Title>
            </Box>

            <S.VoiceflowInput
              readOnly
              value={entityID}
              rightAction={
                <SvgIcon clickable color="rgba(110, 132, 154)" icon="copy" onClick={copyWithToast(entityID)} />
              }
            />
          </Box.FlexAlignStart>
          <Box flex={1} ml={24} mt={25}>
            <SectionV2.Description secondary>
              The name of the agent as you will see it on your dashboard.
            </SectionV2.Description>
          </Box>
        </Box.FlexAlignStart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <SectionV2.SimpleSection>
        <Box.FlexAlignStart fullWidth>
          <Box.FlexAlignStart width={INPUT_WIDTH} flexDirection="column">
            <Box mb={10}>
              <SectionV2.Title bold secondary>
                ACS/Callback URL
              </SectionV2.Title>
            </Box>

            <S.VoiceflowInput
              readOnly
              value={acsURL}
              rightAction={
                <SvgIcon clickable color="rgba(110, 132, 154)" icon="copy" onClick={copyWithToast(acsURL)} />
              }
            />
          </Box.FlexAlignStart>
          <Box flex={1} ml={24} mt={25}>
            <SectionV2.Description secondary>
              This may be called Assertion Consumer Service URL, Post-back URL, or Callback URL.
            </SectionV2.Description>
          </Box>
        </Box.FlexAlignStart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default VoiceflowFields;
