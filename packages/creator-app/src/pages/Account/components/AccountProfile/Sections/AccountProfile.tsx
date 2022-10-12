import { Box, Input, Link, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { Identifier } from '@/styles/constants';

const sectionStyling = {
  paddingBottom: '24px',
};

const AccountProfile: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);

  const accountNameModal = ModalsV2.useModal(ModalsV2.Account.Name);
  const accountEmailModal = ModalsV2.useModal(ModalsV2.Account.Email);
  const accountPasswordModal = ModalsV2.useModal(ModalsV2.Account.Password);

  return (
    <>
      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            <Link onClick={() => accountNameModal.openVoid()}>Change Name</Link>
          </DescriptorContainer>
        )}
        header="Name"
      >
        <Box.Flex mr={120}>
          <Input id={Identifier.USER_NAME_INPUT} value={user.name ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />

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
            <Link onClick={() => accountEmailModal.openVoid()}>Change Email</Link>
          </DescriptorContainer>
        )}
        header="Email"
      >
        <Box.Flex mr={120}>
          <Input id={Identifier.USER_EMAIL_INPUT} value={user.email ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />
        </Box.Flex>
      </Section>

      {!user.isSSO && (
        <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} header="Password">
          <DescriptorContainer style={{ margin: 0 }}>
            <Link onClick={() => accountPasswordModal.openVoid()}>Change Password</Link>
          </DescriptorContainer>
        </Section>
      )}
    </>
  );
};

export default AccountProfile;
