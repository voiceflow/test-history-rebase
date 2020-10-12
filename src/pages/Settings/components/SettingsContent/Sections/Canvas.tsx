import React from 'react';

import { ControlScheme } from '@/components/Canvas/constants';
import RadioGroup from '@/components/RadioGroup';
import Section, { SectionVariant } from '@/components/Section';
import { Link } from '@/components/Text';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { ConnectedProps } from '@/types';

const NavigationDescriptions = {
  [ControlScheme.TRACKPAD]: 'Pan the canvas by sliding two fingers on the trackpad. Zoom by pinching in and out.',
  [ControlScheme.MOUSE]: 'Click and drag to pan the canvas. Zoom by scrolling the mouse wheel.',
};

const NAVIGATION_OPTIONS = [
  {
    id: ControlScheme.TRACKPAD,
    label: 'Trackpad',
  },
  {
    id: ControlScheme.MOUSE,
    label: 'Mouse',
  },
];

const Canvas: React.FC<ConnectedBasicProps> = ({ canvasNavigation, setCanvasNavigation }) => {
  return (
    <>
      <Section
        customContentStyling={{
          paddingBottom: '24px',
        }}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            {NavigationDescriptions[canvasNavigation]} <Link href="https://docs.voiceflow.com/#/platform/settings">See more.</Link>
          </DescriptorContainer>
        )}
        header="Navigation Mode"
      >
        <RadioGroup options={NAVIGATION_OPTIONS} checked={canvasNavigation} onChange={setCanvasNavigation} />
      </Section>
    </>
  );
};

const mapStateToProps = {
  canvasNavigation: UI.canvasNavigationSelector,
};

const mapDispatchToProps = {
  setCanvasNavigation: UI.setCanvasNavigation,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
