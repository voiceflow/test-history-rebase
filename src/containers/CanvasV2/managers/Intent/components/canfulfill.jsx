import React from 'react';

import { SectionToggleVariant, UncontrolledSection } from '@/componentsV2/Section';
import { Paragraph } from '@/componentsV2/Tooltip';
import { PlatformType } from '@/constants';
import { activeLocalesSelector, activePlatformSelector, fulfillmentSelector, isRootDiagramSelector, toggleFulfillment } from '@/ducks/skill';
import { connect } from '@/hocs';
import { ALEXA_BUILT_INS } from '@/utils/intent';

const CAN_FULFILL_LOCALES = ['en-US'];

function CanFulfillForm({ isRoot, intentID, platform, fulfillment, toggleFulfillment, locales }) {
  const validForCanfulfill =
    intentID &&
    isRoot &&
    platform === PlatformType.ALEXA &&
    !ALEXA_BUILT_INS.some(({ id }) => id === intentID) &&
    locales.some((locale) => CAN_FULFILL_LOCALES.includes(locale));

  if (!validForCanfulfill) {
    return null;
  }

  return (
    <UncontrolledSection
      header="Can Fulfill Intent"
      tooltip={
        <>
          <Paragraph marginBottomUnits={2}>
            Can Fulfill (Name-free interaction) enables customers to interact with Alexa without invoking a specific skill by name, which helps
            facilitate greater interaction with Alexa because customers do not always know which skill is appropriate.
          </Paragraph>
          <Paragraph marginBottomUnits={2}>
            When Alexa receives a request from a customer without a skill name, such as "Alexa, play relaxing sounds with crickets," Alexa looks for
            skills that might fulfill the request. Alexa determines the best choice among eligible skills and hands the request to the skill.
          </Paragraph>
          <Paragraph marginBottomUnits={2}>
            This feature is currently supported for the <i>en-US</i> locale only. For more information, reference the{' '}
            <a
              href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/understand-name-free-interaction-for-custom-skills.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Documentation.
            </a>
          </Paragraph>
        </>
      }
      isCollapsed={!fulfillment(intentID)}
      onClick={() => toggleFulfillment(intentID)}
      collapseVariant={SectionToggleVariant.TOGGLE}
    />
  );
}

const mapStateToProps = {
  fulfillment: fulfillmentSelector,
  isRoot: isRootDiagramSelector,
  platform: activePlatformSelector,
  locales: activeLocalesSelector,
};

const mapDispatchToProps = {
  toggleFulfillment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanFulfillForm);
