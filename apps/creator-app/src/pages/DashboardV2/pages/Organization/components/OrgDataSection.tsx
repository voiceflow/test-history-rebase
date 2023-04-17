import { datadogRum } from '@datadog/browser-rum';
import { Box, Input, SectionV2, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import { vfLogo } from '@/assets';
import Page from '@/components/Page';
import * as Organization from '@/ducks/organization';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import * as S from './styles';

const OrgDataSection: React.FC = () => {
  const [organization] = useSelector(Organization.organizationsWhereIsAdminSelector);
  const updateActiveOrganizationName = useDispatch(Organization.updateActiveOrganizationName);
  const updateActiveOrganizationImage = useDispatch(Organization.updateActiveOrganizationImage);
  const [name, updateName] = useLinkedState(organization?.name ?? '');

  const saveName = () => {
    if (!organization) return;

    if (name && name !== organization.name) {
      updateActiveOrganizationName(name);
      return;
    }

    updateName(organization.name);
  };

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Workspace</Page.Section.Title>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
        <Box.Flex gap={24} fullWidth>
          <Upload.Provider
            client={{
              upload: (_endpoint, _fileType, formData) => updateActiveOrganizationImage(formData),
            }}
            onError={datadogRum.addError}
          >
            <S.UploadIcon size={UploadIconVariant.SMALLER} isSquare image={organization?.image || vfLogo} />
          </Upload.Provider>

          <Box.FlexAlignStart column gap={11} fullWidth>
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>

            <Box.FlexApart gap={16} fullWidth>
              <Input name="name" value={name} onBlur={saveName} onChangeText={updateName} placeholder="Organization Name" />
            </Box.FlexApart>
          </Box.FlexAlignStart>
        </Box.Flex>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default OrgDataSection;
