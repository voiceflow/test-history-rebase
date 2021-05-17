import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section, { SectionVariant } from '@/components/Section';
import { Link } from '@/components/Text';
import * as Documentation from '@/config/documentation';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import { ConnectedProps, MergeArguments } from '@/types';

import { LINK_TYPE_OPTIONS, NAVIGATION_DESCRIPTIONS, NAVIGATION_OPTIONS } from './constants';

const Canvas: React.FC<ConnectedBasicProps> = ({ project, canvasNavigation, setCanvasNavigation, updateProjectLinkType }) => {
  const [linkType, setLineType] = React.useState(project.linkType);

  useDidUpdateEffect(() => {
    updateProjectLinkType(project.id, linkType);
  }, [linkType]);

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
        <RadioGroup options={LINK_TYPE_OPTIONS} checked={linkType} onChange={setLineType} />
      </Section>
    </>
  );
};

const mapStateToProps = {
  projectID: Session.activeProjectIDSelector,
  canvasNavigation: UI.canvasNavigationSelector,
  projectByIDSelector: Project.projectByIDSelector,
};

const mapDispatchToProps = {
  setCanvasNavigation: UI.setCanvasNavigation,
  updateProjectLinkType: Project.updateProjectLinkType,
};

const mergeProps = (...[{ projectID, projectByIDSelector }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  project: projectByIDSelector(projectID!),
});

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Canvas);
