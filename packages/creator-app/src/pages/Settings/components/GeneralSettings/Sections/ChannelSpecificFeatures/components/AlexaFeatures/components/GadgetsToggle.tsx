import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';
import { ConnectedProps } from '@/types';

interface AlexaGadgetsToggleOwnProps {
  modelSensitivityShown?: boolean;
}

const AlexaGadgetsToggle: React.FC<AlexaGadgetsToggleOwnProps & ConnectedAlexaGadgetsToggleProps> = ({
  customInterfaceEnabled,
  patchSettings,
  modelSensitivityShown,
}) => {
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);

  return (
    <>
      {gadgets.isEnabled && (
        <UncontrolledSection
          emptyChildren
          contentPrefix={<Alexa.Gadgets />}
          header="Custom Interface"
          headerToggle
          dividers={modelSensitivityShown}
          isDividerNested
          isCollapsed={!customInterfaceEnabled}
          onClick={() => patchSettings({ customInterface: !customInterfaceEnabled })}
          variant={SectionVariant.SECONDARY}
          collapseVariant={SectionToggleVariant.TOGGLE}
        />
      )}
    </>
  );
};

const mapStateToProps = {
  customInterfaceEnabled: VersionV2.active.alexa.customInterfaceSelector,
};

const mapDispatchToProps = {
  patchSettings: Version.alexa.patchSettings,
};

type ConnectedAlexaGadgetsToggleProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgetsToggle) as React.FC<AlexaGadgetsToggleOwnProps>;
