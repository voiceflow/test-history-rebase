import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as Account from '@/ducks/account';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { Identifier } from '@/styles/constants';
import * as Sentry from '@/vendors/sentry';

const Profile: React.OldFC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);
  const updateUserProfileImage = useDispatch(Account.updateUserProfileImage);
  const identityWorkspace = useFeature(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

  const accountNameModal = ModalsV2.useModal(ModalsV2.Account.Name);
  const accountEmailModal = ModalsV2.useModal(ModalsV2.Account.Email);
  const accountPasswordModal = ModalsV2.useModal(ModalsV2.Account.Password);

  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Profile</Page.Section.Title>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
        <Box.Flex gap={24} fullWidth>
          {identityWorkspace.isEnabled ? (
            <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateUserProfileImage(formData) }} onError={Sentry.error}>
              <Upload.IconUpload size={UploadIconVariant.SMALLER} update={saveProfilePicture} isSquare user={user} />
            </Upload.Provider>
          ) : (
            <Upload.IconUpload size={UploadIconVariant.SMALLER} update={saveProfilePicture} isSquare user={user} />
          )}

          <Box.FlexAlignStart column gap={12} fullWidth>
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>

            <Box.FlexApart gap={16} fullWidth>
              <Input id={Identifier.USER_NAME_INPUT} value={user.name ?? ''} readOnly disabled />

              <Button variant={Button.Variant.SECONDARY} flat onClick={() => accountNameModal.openVoid()}>
                Edit
              </Button>
            </Box.FlexApart>
          </Box.FlexAlignStart>
        </Box.Flex>
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
        <Box.FlexAlignStart column gap={12} fullWidth>
          <SectionV2.Title bold secondary>
            Email
          </SectionV2.Title>

          <Box.FlexApart gap={16} fullWidth>
            <Input id={Identifier.USER_EMAIL_INPUT} value={user.email ?? ''} readOnly disabled />
            <Button variant={Button.Variant.SECONDARY} flat onClick={() => accountEmailModal.openVoid()}>
              Edit
            </Button>
          </Box.FlexApart>
        </Box.FlexAlignStart>
      </SectionV2.SimpleSection>

      {!user.isSSO && (
        <>
          <SectionV2.Divider />

          <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
            <Box.FlexAlignStart column gap={12} fullWidth>
              <SectionV2.Title bold secondary>
                Password
              </SectionV2.Title>

              <Box.FlexApart gap={16} fullWidth>
                <Input value="·····································" readOnly disabled />
                <Button variant={Button.Variant.SECONDARY} flat onClick={() => accountPasswordModal.openVoid()}>
                  Edit
                </Button>
              </Box.FlexApart>
            </Box.FlexAlignStart>
          </SectionV2.SimpleSection>
        </>
      )}
    </Page.Section>
  );
};

export default Profile;
