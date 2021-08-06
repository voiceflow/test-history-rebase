import React from 'react';

import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { Alexa } from '@/pages/Settings/components/ContentDescriptors';
import { ConnectedProps } from '@/types';

interface AlexaGadgetsToggleOwnProps {
  modelSensitivityShown?: boolean;
}

const AlexaGadgetsToggle: React.FC<AlexaGadgetsToggleOwnProps & ConnectedAlexaGadgetsToggleProps> = ({
  customInterfaceEnabled,
  saveSettings,
  modelSensitivityShown,
}) => {
  const gadgets = useFeature(FeatureFlag.GADGETS);

  return (
    <>
      {gadgets.isEnabled && (
        <UncontrolledSection
          emptyChildren
          contentPrefix={Alexa.Gadgets}
          header="Custom Interface"
          headerToggle
          dividers={modelSensitivityShown}
          isDividerNested
          isCollapsed={!customInterfaceEnabled}
          onClick={() => saveSettings({ customInterface: !customInterfaceEnabled })}
          variant={SectionVariant.SECONDARY}
          collapseVariant={SectionToggleVariant.TOGGLE}
        />
      )}
    </>
  );
};

const mapStateToProps = {
  customInterfaceEnabled: Version.alexa.activeCustomInterfaceSelector,
};

const mapDispatchToProps = {
  saveSettings: Version.saveSettings,
};

type ConnectedAlexaGadgetsToggleProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AlexaGadgetsToggle) as React.FC<AlexaGadgetsToggleOwnProps>;
