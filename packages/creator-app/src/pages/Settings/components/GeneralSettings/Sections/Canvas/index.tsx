import { ProjectLinkType } from '@voiceflow/api-sdk';
import { Link } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionVariant } from '@/components/Section';
import * as Documentation from '@/config/documentation';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { ConnectedProps } from '@/types';

import { LINK_TYPE_OPTIONS, NAVIGATION_DESCRIPTIONS, NAVIGATION_OPTIONS } from './constants';

const Canvas: React.FC<ConnectedBasicProps> = ({ activeProjectID, activeLinkType, canvasNavigation, setCanvasNavigation, saveProjectLinkType }) => {
  const setLinkType = React.useCallback((linkType: ProjectLinkType) => saveProjectLinkType(activeProjectID!, linkType), [activeProjectID]);

  return (
    <>
      <Section
        header="Navigation Mode"
        variant={SectionVariant.QUATERNARY}
        contentSuffix={() => (
          <DescriptorContainer>
            {NAVIGATION_DESCRIPTIONS[canvasNavigation]} <Link href={Documentation.CANVAS_CONTROLS}>See more.</Link>
          </DescriptorContainer>
        )}
        customContentStyling={{ paddingBottom: '24px' }}
      >
        <RadioGroup options={NAVIGATION_OPTIONS} checked={canvasNavigation} onChange={setCanvasNavigation} />
      </Section>

      <Section
        header="Line Type"
        variant={SectionVariant.QUATERNARY}
        dividers
        isDividerNested
        contentSuffix={() => (
          <DescriptorContainer>
            Choose between straight or curved connection lines between blocks. <Link href={Documentation.LINK_TYPE}>See more.</Link>
          </DescriptorContainer>
        )}
        customContentStyling={{ paddingBottom: '24px' }}
      >
        <RadioGroup options={LINK_TYPE_OPTIONS} checked={activeLinkType} onChange={setLinkType} />
      </Section>
    </>
  );
};

const mapStateToProps = {
  canvasNavigation: UI.canvasNavigationSelector,
  activeProjectID: Session.activeProjectIDSelector,
  activeLinkType: Project.activeProjectLinkTypeSelector,
};

const mapDispatchToProps = {
  setCanvasNavigation: UI.setCanvasNavigation,
  saveProjectLinkType: Project.saveProjectLinkType,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
