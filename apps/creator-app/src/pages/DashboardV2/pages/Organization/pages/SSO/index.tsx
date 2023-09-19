import { Button, SectionV2, useSmartReducerV2 } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import Page from '@/components/Page';
import { AUTH_API_ENDPOINT } from '@/config';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useAsyncEffect, useToggle } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

import * as S from '../../styles';
import { CertificateField, EntityURLField, SSOTargetURLField, VoiceflowFields } from './components';

const OrganizationSSO: React.FC = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);

  const [loading, toggleLoading] = useToggle(false);

  const [state, stateAPI] = useSmartReducerV2({
    id: null as number | string | null,
    issuer: '',
    entryPoint: '',
    certificate: '',
    editCertificate: true,
  });

  const onSaveIdentity = async (organizationID: string) => {
    let providerID = state.id;

    if (providerID === null) {
      const provider = await client.identity.provider.createOneForOrganization(organizationID, {
        issuer: state.issuer,
        entryPoint: state.entryPoint,
        certificate: state.certificate,
      });

      stateAPI.set({
        id: provider.id,
        issuer: provider.issuer,
        entryPoint: provider.entryPoint,
        certificate: provider.certificate,
        editCertificate: !provider.certificate,
      });

      providerID = provider.id;
    } else {
      await client.identity.provider.patchOneForOrganization(organizationID, {
        issuer: state.issuer,
        entryPoint: state.entryPoint,
        certificate: state.editCertificate ? state.certificate : undefined,
      });
    }

    await client.auth.v1.sso.validateSaml2Provider(providerID);
  };

  const onSave = async () => {
    if (!organizationID) return;

    try {
      toggleLoading(true);

      await onSaveIdentity(organizationID);

      toast.success('Successfully updated SAML SSO configuration');
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(`Invalid SAML configuration: ${message}`);
    } finally {
      toggleLoading(false);
    }
  };

  useAsyncEffect(async () => {
    if (!organizationID) {
      toast.error('no organization found');

      return;
    }

    try {
      const provider = await client.identity.provider.findOneByOrganizationID(organizationID);

      stateAPI.set({
        id: provider.id,
        issuer: provider.issuer,
        entryPoint: provider.entryPoint,
        certificate: provider.certificate,
        editCertificate: !provider.certificate,
      });
    } catch {
      // skip
    }
  }, []);

  return (
    <>
      {state.id && <VoiceflowFields entityID="https://voiceflow.com" acsURL={`${AUTH_API_ENDPOINT}/v1/sso/saml2/${state.id}/authenticate`} />}

      <Page.Section>
        <EntityURLField value={state.issuer} onChange={stateAPI.issuer.set} />

        <SectionV2.Divider />

        <SSOTargetURLField value={state.entryPoint} onChange={stateAPI.entryPoint.set} />

        <SectionV2.Divider />

        <CertificateField
          onChange={stateAPI.certificate.set}
          certificate={state.certificate}
          editCertificate={state.editCertificate}
          onEditCertificate={() => stateAPI.update({ certificate: '', editCertificate: true })}
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
