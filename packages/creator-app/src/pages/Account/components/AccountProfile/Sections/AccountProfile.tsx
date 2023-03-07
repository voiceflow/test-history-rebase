import { datadogRum } from '@datadog/browser-rum';
import { Box, Input, Link, SectionV2, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { Identifier } from '@/styles/constants';

const AccountProfile: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);
  const updateUserProfileImage = useDispatch(Account.updateUserProfileImage);

  const accountNameModal = ModalsV2.useModal(ModalsV2.Account.Name);
  const accountEmailModal = ModalsV2.useModal(ModalsV2.Account.Email);
  const accountPasswordModal = ModalsV2.useModal(ModalsV2.Account.Password);

  return (
    <>
      <Settings.SubSection header="Name" splitView>
        <Box.Flex gap={16}>
          <Input id={Identifier.USER_NAME_INPUT} value={user.name ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />

          <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateUserProfileImage(formData) }} onError={datadogRum.addError}>
            <Upload.IconUpload image={user.image} size={UploadIconVariant.EXTRA_SMALL} update={saveProfilePicture} />
          </Upload.Provider>
        </Box.Flex>

        <Box.Flex alignSelf="center" fullHeight>
          <Settings.SubSection.Description>
            <Link onClick={() => accountNameModal.openVoid()}>Change Name</Link>
          </Settings.SubSection.Description>
        </Box.Flex>
      </Settings.SubSection>

      <SectionV2.Divider />

      <Settings.SubSection header="Email" splitView>
        <Box.Flex gap={16}>
          <Input id={Identifier.USER_EMAIL_INPUT} value={user.email ?? ''} readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />
        </Box.Flex>

        <Box.Flex alignSelf="center" fullHeight>
          <Settings.SubSection.Description>
            <Link onClick={() => accountEmailModal.openVoid()}>Change Email</Link>
          </Settings.SubSection.Description>
        </Box.Flex>
      </Settings.SubSection>

      {!user.isSSO && (
        <>
          <SectionV2.Divider />

          <Settings.SubSection header="Password" splitView>
            <Box.Flex gap={16}>
              <Input type="password" value="*******" readOnly disabled style={{ color: 'rgba(19, 33, 68, 0.65)' }} />
            </Box.Flex>

            <Box.Flex alignSelf="center" fullHeight>
              <Settings.SubSection.Description>
                <Link onClick={() => accountPasswordModal.openVoid()}>Change Password</Link>
              </Settings.SubSection.Description>
            </Box.Flex>
          </Settings.SubSection>
        </>
      )}
    </>
  );
};

export default AccountProfile;
