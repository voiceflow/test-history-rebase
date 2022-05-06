import { Box, BoxFlex, Input, Link, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

const sectionStyling = {
  paddingBottom: '24px',
};

const AccountProfile: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);
  const profileNameModal = useModals(ModalType.PROFILE_NAME_MODAL);
  const changeEmailModal = useModals(ModalType.CHANGE_EMAIL_MODAL);
  const changePasswordModal = useModals(ModalType.CHANGE_PASSWORD_MODAL);
  const { gid, okta_id, fid, saml_provider_id } = user;
  const isNotSSOUser = !gid && !okta_id && !fid && !saml_provider_id;

  return (
    <>
      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            <Link onClick={() => profileNameModal.open()}>Change Name</Link>
          </DescriptorContainer>
        )}
        header="Name"
      >
        <BoxFlex mr={120}>
          <Input value={user.name ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />

          <Box ml={16}>
            <Upload.IconUpload image={user.image} size={UploadIconVariant.EXTRA_SMALL} update={saveProfilePicture} />
          </Box>
        </BoxFlex>
      </Section>

      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            <Link onClick={() => changeEmailModal.open()}>Change Email</Link>
          </DescriptorContainer>
        )}
        header="Email"
      >
        <BoxFlex mr={120}>
          <Input value={user.email ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />
        </BoxFlex>
      </Section>

      {isNotSSOUser && (
        <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} header="Password">
          <DescriptorContainer style={{ margin: 0 }}>
            <Link onClick={() => changePasswordModal.open()}>Change Password</Link>
          </DescriptorContainer>
        </Section>
      )}
    </>
  );
};

export default AccountProfile;
