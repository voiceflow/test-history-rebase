import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import Page from '@/components/Page';
import { API_ENDPOINT } from '@/config';
import * as Feature from '@/ducks/feature';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAsyncEffect, useToggle } from '@/hooks';
import { SAMLProvider } from '@/models';

import * as S from '../../styles';
import { CertificateField, EntityURLField, SSOTargetURLField, VoiceflowFields } from './components';

const DEFAULT_STATE: SAMLProvider = {
  _id: '',
  issuer: '',
  entryPoint: '',
  certificate: '',
  organizationID: '',
};

const OrganizationSSO: React.FC = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
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
  }, []);

  return (
    <>
      <VoiceflowFields entityID="https://voiceflow.com" acsURL={`${API_ENDPOINT}/saml/${samlProvider._id}/login`} />

      <Page.Section>
        <EntityURLField issuer={samlProvider.issuer} onChange={(issuer) => samlProviderAPI.update({ issuer })} />
        <SectionV2.Divider />
        <SSOTargetURLField onChangeText={(entryPoint) => samlProviderAPI.update({ entryPoint })} entryPoint={samlProvider.entryPoint} />
        <SectionV2.Divider />
        <CertificateField
          onChange={(certificate) => samlProviderAPI.update({ certificate })}
          certificate={samlProvider.certificate}
          onEditCertificate={onEditCertificate}
          editCertificate={editCertificate}
        />

        <S.Footer>
          <Button disabled={loading} onClick={onSave}>
            Save Configuration
          </Button>
        </S.Footer>
      </Page.Section>
    </>
  );
};

export default OrganizationSSO;
