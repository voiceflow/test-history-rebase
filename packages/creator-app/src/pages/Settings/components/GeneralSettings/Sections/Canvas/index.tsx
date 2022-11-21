import { BaseModels } from '@voiceflow/base-types';
import { Link } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import * as Documentation from '@/config/documentation';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { ConnectedProps } from '@/types';

import { LINK_TYPE_OPTIONS, NAVIGATION_DESCRIPTIONS, NAVIGATION_OPTIONS, ZOOM_OPTIONS } from './constants';

const headerStyling = {
  paddingBottom: '11px',
};

const sectionStyling = {
  paddingBottom: '24px',
};

const Canvas: React.FC<ConnectedBasicProps> = ({
  activeProjectID,
  activeLinkType,
  zoomType,
  setZoomType,
  canvasNavigation,
  setCanvasNavigation,
  updateProjectLinkType,
  canvasGridEnabled,
  toggleCanvasGrid,
}) => {
  const setLinkType = React.useCallback(
    (linkType: BaseModels.Project.LinkType) => updateProjectLinkType(activeProjectID!, linkType),
    [activeProjectID]
  );

  return (
    <>
      <Section
        header="Navigation"
        variant={SectionVariant.QUATERNARY}
        contentSuffix={
          <DescriptorContainer>
            {NAVIGATION_DESCRIPTIONS[canvasNavigation]} <Link href={Documentation.CANVAS_CONTROLS}>See more.</Link>
          </DescriptorContainer>
        }
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        <RadioGroup options={NAVIGATION_OPTIONS} checked={canvasNavigation} onChange={setCanvasNavigation} />
      </Section>

      <Section header="Zoom Preference" variant={SectionVariant.QUATERNARY} customHeaderStyling={headerStyling} customContentStyling={sectionStyling}>
        <RadioGroup options={ZOOM_OPTIONS} checked={zoomType} onChange={setZoomType} />
      </Section>

      <Section
        header="Connectors"
        variant={SectionVariant.QUATERNARY}
        dividers
        contentSuffix={
          <DescriptorContainer>
            Choose between straight or curved connection lines between blocks. <Link href={Documentation.LINK_TYPE}>See more.</Link>
          </DescriptorContainer>
        }
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        <RadioGroup options={LINK_TYPE_OPTIONS} checked={activeLinkType} onChange={setLinkType} />
      </Section>

      <Section
        header="Canvas Grid"
        variant={SectionVariant.QUATERNARY}
        dividers
        collapseVariant={SectionToggleVariant.TOGGLE}
        onToggleChange={toggleCanvasGrid}
        contentSuffix={
          <DescriptorContainer style={{ marginTop: '6px' }}>When on, the canvas will have a dotted background grid.</DescriptorContainer>
        }
        customHeaderStyling={{ paddingBottom: '0px' }}
        customContentStyling={sectionStyling}
        initialOpen={!!canvasGridEnabled}
      >
        <span></span>
      </Section>
    </>
  );
};

const mapStateToProps = {
  canvasNavigation: UI.canvasNavigationSelector,
  canvasGridEnabled: UI.isCanvasGridEnabledSelector,
  zoomType: UI.zoomTypeSelector,
  activeProjectID: Session.activeProjectIDSelector,
  activeLinkType: ProjectV2.active.linkTypeSelector,
};

const mapDispatchToProps = {
  setCanvasNavigation: UI.setCanvasNavigation,
  updateProjectLinkType: Project.updateProjectLinkType,
  setZoomType: UI.setZoomType,
  toggleCanvasGrid: UI.toggleCanvasGrid,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
