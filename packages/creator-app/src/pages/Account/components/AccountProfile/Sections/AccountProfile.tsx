import { Box, Input, Link, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

const sectionStyling = {
  paddingBottom: '24px',
};

const AccountProfile: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);
  const profileNameModal = ModalsV2.useModal(ModalsV2.ChangeName);
  const changeEmailModal = ModalsV2.useModal(ModalsV2.ChangeEmail);
  const changePasswordModal = ModalsV2.useModal(ModalsV2.ChangePassword);
  const { gid, okta_id, fid, saml_provider_id } = user;
  const isNotSSOUser = !gid && !okta_id && !fid && !saml_provider_id;

  return (
    <>
      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            <Link onClick={() => profileNameModal.openVoid({})}>Change Name</Link>
          </DescriptorContainer>
        )}
        header="Name"
      >
        <Box.Flex mr={120}>
          <Input value={user.name ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />

          <Box ml={16}>
            <Upload.IconUpload image={user.image} size={UploadIconVariant.EXTRA_SMALL} update={saveProfilePicture} />
          </Box>
        </Box.Flex>
      </Section>

      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            <Link onClick={() => changeEmailModal.openVoid({})}>Change Email</Link>
          </DescriptorContainer>
        )}
        header="Email"
      >
        <Box.Flex mr={120}>
          <Input value={user.email ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />
        </Box.Flex>
      </Section>

      {isNotSSOUser && (
        <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} header="Password">
          <DescriptorContainer style={{ margin: 0 }}>
            <Link onClick={() => changePasswordModal.openVoid({})}>Change Password</Link>
          </DescriptorContainer>
        </Section>
      )}
    </>
  );
};

export default AccountProfile;
