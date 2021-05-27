import React from 'react';

import Box from '@/components/Box';
import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import ColorInput from './ColorInput';
import NegativeMarginContainer from './NegativeMarginContainer';
import UploadContainer from './UploadContainer';
import UploadContent from './UploadContent';

type AppearanceAndBrandingProps = {
  isAllowed: boolean;
};

const AppearanceAndBranding: React.FC<AppearanceAndBrandingProps & ConnectedAppearanceAndBrandingProps> = ({
  isAllowed,
  brandImage,
  avatar,
  updateSettings,
}) => (
  <Box cursor={isAllowed ? 'default' : 'not-allowed'}>
    <ColorInput isAllowed={isAllowed} disabledBorderColor="rgba(210, 218, 226, 0.65)" />
    <NegativeMarginContainer>
      <Divider style={{ marginTop: '24px', marginBottom: 0 }} />
      <UploadContainer>
        <UploadContent
          title="Brand Image"
          isAllowed={isAllowed}
          initialState={brandImage}
          isSquare={true}
          hasBorderRight={true}
          updateSettings={(image) => updateSettings({ brandImage: image })}
        />
        <UploadContent
          title="Message Icon"
          isAllowed={isAllowed}
          initialState={avatar}
          isSquare={false}
          hasBorderRight={false}
          updateSettings={(image) => updateSettings({ avatar: image })}
        />
      </UploadContainer>
      <Divider style={{ marginTop: 0, marginBottom: '32px' }} />
    </NegativeMarginContainer>
  </Box>
);

const mapStateToProps = {
  brandImage: Prototype.prototypeBrandImageSelector,
  avatar: Prototype.prototypeAvatarSelector,
};

const mapDispatchProps = {
  updateSettings: Prototype.updateSharePrototypeSettings,
};

type ConnectedAppearanceAndBrandingProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;

export default connect(mapStateToProps, mapDispatchProps)(AppearanceAndBranding) as React.FC<AppearanceAndBrandingProps>;
