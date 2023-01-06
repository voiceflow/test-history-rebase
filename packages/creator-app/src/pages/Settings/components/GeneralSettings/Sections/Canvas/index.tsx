import { BaseModels } from '@voiceflow/base-types';
import { Box, Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { ControlScheme } from '@/components/Canvas/constants';
import RadioGroup from '@/components/RadioGroup';
import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as Documentation from '@/config/documentation';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

import { CanvasGrid } from './components';
import { LINK_TYPE_OPTIONS, NAVIGATION_DESCRIPTIONS, NAVIGATION_OPTIONS, ZOOM_OPTIONS } from './constants';

const Canvas: React.OldFC = () => {
  const canvasNavigation = useSelector(UI.canvasNavigationSelector);
  const zoomType = useSelector(UI.zoomTypeSelector);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const activeLinkType = useSelector(ProjectV2.active.linkTypeSelector);
  const setCanvasNavigation = useDispatch(UI.setCanvasNavigation);
  const updateProjectLinkType = useDispatch(Project.updateProjectLinkType);
  const setZoomType = useDispatch(UI.setZoomType);

  const setLinkType = React.useCallback(
    (linkType: BaseModels.Project.LinkType) => updateProjectLinkType(activeProjectID!, linkType),
    [activeProjectID]
  );

  return (
    <>
      <SettingsSection variant={SectionVariants.PRIMARY} title="Canvas Interactions" marginBottom={16}>
        <SettingsSubSection
          header="Navigation"
          leftDescription={
            <DescriptorContainer>
              {NAVIGATION_DESCRIPTIONS[canvasNavigation]} <Link href={Documentation.CANVAS_CONTROLS}>Learn more</Link>
            </DescriptorContainer>
          }
          radioButton
          descriptionOffset={canvasNavigation === ControlScheme.MOUSE ? 42 : 0}
        >
          <Box width="318px">
            <RadioGroup
              options={NAVIGATION_OPTIONS}
              checked={canvasNavigation}
              onChange={setCanvasNavigation}
              column
              activeBar
              noPaddingLastItem={false}
              width={318}
            />
          </Box>
        </SettingsSubSection>

        <SectionV2.Divider />

        <SettingsSubSection header="Zoom Preference" radioButton>
          <Box width="318px">
            <RadioGroup options={ZOOM_OPTIONS} checked={zoomType} onChange={setZoomType} column activeBar noPaddingLastItem={false} />
          </Box>
        </SettingsSubSection>

        <SectionV2.Divider />

        <SettingsSubSection
          header="Connectors"
          leftDescription={
            <DescriptorContainer>
              Choose between straight or curved connection lines between blocks. <Link href={Documentation.LINK_TYPE}>Learn more</Link>
            </DescriptorContainer>
          }
          radioButton
          descriptionOffset={activeLinkType === BaseModels.Project.LinkType.CURVED ? 42 : 0}
        >
          <Box width="318px">
            <RadioGroup options={LINK_TYPE_OPTIONS} checked={activeLinkType} onChange={setLinkType} column activeBar noPaddingLastItem={false} />
          </Box>
        </SettingsSubSection>
      </SettingsSection>
      <CanvasGrid />
    </>
  );
};

export default Canvas;
