import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ClickableText, FlexEnd, Input, SectionV2, Spinner, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as Settings from '@/components/Settings';
import { StaticTextArea } from '@/components/TextArea';
import { API_ENDPOINT } from '@/config';
import * as Feature from '@/ducks/feature';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAsyncEffect, useToggle } from '@/hooks';
import { SAMLProvider } from '@/models';
import { copyWithToast } from '@/utils/clipboard';

const ENTITY_ID = 'https://voiceflow.com';
const TITLE = 'SAML SSO';

const DEFAULT_STATE: SAMLProvider = {
  _id: '',
  issuer: '',
  entryPoint: '',
  certificate: '',
  organizationID: '',
};

const SSOPage: React.FC = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const [initializing, toggleInitializing] = useToggle(true);
  const [loading, toggleLoading] = useToggle(false);
  const [editCertificate, toggleEditCertificate] = useToggle(true);

  const isIdentityWorkspaceEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_SAML2_PROVIDER);

  const [samlProvider, samlProviderAPI] = useSmartReducerV2<SAMLProvider>(DEFAULT_STATE);

  const onSave = async () => {
    if (!samlProvider._id) {
      return;
    }

    toggleLoading(true);
    await client.saml.update({ ...samlProvider, certificate: editCertificate ? samlProvider.certificate : '' });
    try {
      await client.saml.validations(samlProvider._id);
      toast.success('Successfully updated SAML SSO configuration');
    } catch (error) {
      toast.error('Invalid SAML configuration. Please try again, or contact support.');
    }
    toggleLoading(false);
  };

  const onEditCertificate = () => {
    samlProviderAPI.update({ certificate: '' });
    toggleEditCertificate(true);
  };

  useAsyncEffect(async () => {
    if (!organizationID) {
      toast.error('no organization found');
      return;
    }

    const provider = isIdentityWorkspaceEnabled
      ? await client.identity.provider.findOneByOrganizationDomain(organizationID)
      : await client.saml.getForOrganization(organizationID);
    if (provider.certificate) {
      toggleEditCertificate(false);
    }
    samlProviderAPI.set(provider);
    toggleInitializing(false);
  }, []);

  const ACS_URL = `${API_ENDPOINT}/saml/${samlProvider._id}/login`;

  if (initializing) {
    return (
      <Settings.Section title={TITLE}>
        <Settings.Card>
          <Box.FlexCenter pt={20}>
            <Spinner isMd />
          </Box.FlexCenter>
        </Settings.Card>
      </Settings.Section>
    );
  }

  return (
    <Settings.Section title={TITLE}>
      <Settings.Card>
        <Settings.SubSection header="Audience URI (SP Entity ID)" splitView>
          <Input value={ENTITY_ID} disabled rightAction={<ClickableText onClick={copyWithToast(ENTITY_ID)}>copy</ClickableText>} />

          <div />
        </Settings.SubSection>

        <SectionV2.Divider inset />

        <Settings.SubSection header="ACS/Callback URL" splitView>
          <Input value={ACS_URL} disabled rightAction={<ClickableText onClick={copyWithToast(ACS_URL)}>copy</ClickableText>} />

          <Settings.SubSection.Description>
            This may be called <b>Assertion Consumer Service URL</b>, <b>Post-back URL</b>, or <b>Callback URL</b>. The endpoint where the IdP will
            redirect with its authentication response.
          </Settings.SubSection.Description>
        </Settings.SubSection>

        <SectionV2.Divider inset />

        <Settings.SubSection header="Entity ID URL" splitView>
          <Input placeholder="Enter entity ID URL" value={samlProvider.issuer} onChangeText={(issuer) => samlProviderAPI.update({ issuer })} />

          <Settings.SubSection.Description>The IdP Entity ID for the identity provider your organization uses.</Settings.SubSection.Description>
        </Settings.SubSection>

        <SectionV2.Divider inset />

        <Settings.SubSection header="IdP SSO Target URL" splitView>
          <Input
            value={samlProvider.entryPoint}
            placeholder="Enter SSO target URL"
            onChangeText={(entryPoint) => samlProviderAPI.update({ entryPoint })}
          />

          <Settings.SubSection.Description>The URL users of your organization will be directed to on log in.</Settings.SubSection.Description>
        </Settings.SubSection>

        <SectionV2.Divider inset />

        <Settings.SubSection header="X.509 certificate" splitView>
          {editCertificate ? (
            <StaticTextArea
              rows={5}
              value={samlProvider.certificate}
              onChange={({ target: { value: certificate } }) => samlProviderAPI.update({ certificate })}
              placeholder="Paste X.509 certificate text"
            />
          ) : (
            <Box>
              <b>{samlProvider.certificate}</b> (<ClickableText onClick={onEditCertificate}>edit</ClickableText>)
            </Box>
          )}

          <div />
        </Settings.SubSection>

        <SectionV2.Divider />

        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <FlexEnd>
            <Button onClick={onSave} disabled={loading}>
              Save Configuration
            </Button>
          </FlexEnd>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default SSOPage;
