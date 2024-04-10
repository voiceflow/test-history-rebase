import { BaseModels } from '@voiceflow/base-types';
import { Link, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { ControlScheme } from '@/components/Canvas/constants';
import RadioGroup from '@/components/RadioGroup';
import * as Settings from '@/components/Settings';
import * as Documentation from '@/config/documentation';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';

import { CanvasGrid } from './components';
import { LINK_TYPE_OPTIONS, NAVIGATION_DESCRIPTIONS, NAVIGATION_OPTIONS, ZOOM_OPTIONS } from './constants';

const Canvas: React.FC = () => {
  const canvasNavigation = useSelector(UI.selectors.canvasNavigation);
  const zoomType = useSelector(UI.selectors.zoomType);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const activeLinkType = useSelector(ProjectV2.active.linkTypeSelector);
  const setCanvasNavigation = useDispatch(UI.action.SetCanvasNavigation);
  const updateProjectLinkType = useDispatch(ProjectV2.updateProjectLinkType);
  const setZoomType = useDispatch(UI.action.SetZoomType);

  const setLinkType = React.useCallback(
    (linkType: BaseModels.Project.LinkType) => updateProjectLinkType(activeProjectID!, linkType),
    [activeProjectID]
  );

  return (
    <>
      <Settings.Section title="Canvas Interactions" mb={16}>
        <Settings.Card>
          <Settings.SubSection header="Navigation" splitView>
            <Settings.SubSection.RadioGroupContainer>
              <RadioGroup
                width={318}
                column
                options={NAVIGATION_OPTIONS}
                checked={canvasNavigation}
                onChange={setCanvasNavigation}
                activeBar
                noPaddingLastItem={false}
              />
            </Settings.SubSection.RadioGroupContainer>

            <Settings.SubSection.RadioGroupDescription offset={canvasNavigation === ControlScheme.MOUSE}>
              {NAVIGATION_DESCRIPTIONS[canvasNavigation]} <Link href={Documentation.CANVAS_CONTROLS}>Learn more</Link>
            </Settings.SubSection.RadioGroupDescription>
          </Settings.SubSection>

          <SectionV2.Divider />

          <Settings.SubSection header="Zoom Preference" splitView>
            <Settings.SubSection.RadioGroupContainer>
              <RadioGroup width={318} options={ZOOM_OPTIONS} checked={zoomType} onChange={setZoomType} column activeBar noPaddingLastItem={false} />
            </Settings.SubSection.RadioGroupContainer>

            <div />
          </Settings.SubSection>

          <SectionV2.Divider />

          <Settings.SubSection header="Connectors" splitView>
            <Settings.SubSection.RadioGroupContainer>
              <RadioGroup
                width={318}
                column
                options={LINK_TYPE_OPTIONS}
                checked={activeLinkType}
                onChange={setLinkType}
                activeBar
                noPaddingLastItem={false}
              />
            </Settings.SubSection.RadioGroupContainer>

            <Settings.SubSection.RadioGroupDescription offset={activeLinkType === BaseModels.Project.LinkType.CURVED}>
              Choose between straight or curved connection lines between blocks. <Link href={Documentation.LINK_TYPE}>Learn more</Link>
            </Settings.SubSection.RadioGroupDescription>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>

      <CanvasGrid />
    </>
  );
};

export default Canvas;
