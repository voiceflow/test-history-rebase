import { Box } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import ColorInput from './ColorInput';
import NegativeMarginContainer from './NegativeMarginContainer';
import UploadContainer from './UploadContainer';
import UploadContent from './UploadContent';

interface AppearanceAndBrandingProps {
  isAllowed: boolean;
}

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
          id={Identifier.BRAND_IMAGE_INPUT_CONTAINER}
          title="Brand Image"
          isAllowed={isAllowed}
          initialState={brandImage}
          isSquare={true}
          hasBorderRight={true}
          updateSettings={(image) => updateSettings({ brandImage: image })}
        />
        <UploadContent
          id={Identifier.MESSAGE_ICON_INPUT_CONTAINER}
          title="Message Icon"
          isAllowed={isAllowed}
          initialState={avatar}
          isSquare={false}
          hasBorderRight={false}
          updateSettings={(image) => updateSettings({ avatar: image })}
        />
      </UploadContainer>
      <Divider offset={0} />
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
