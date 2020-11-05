import React from 'react';

import { PLATFORM_META, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps } from '@/types';
import { getPlatformValue } from '@/utils/platform';

export type InvocationStepProps = ConnectedInvocationStepProps & {
  portID?: string | null;
  platform: PlatformType;
};

export const InvocationStep: React.FC<InvocationStepProps> = ({ projectName, invocationName, platform, portID }) => {
  const label = getPlatformValue(
    platform,
    {
      [PlatformType.ALEXA]: `Alexa, open ${invocationName}`,
      [PlatformType.GOOGLE]: `Hey Google, start ${invocationName || projectName}`,
    },
    'Project starts here'
  );

  return (
    <Step disableHighlightStyle={platform === PlatformType.GENERAL}>
      <Section>
        <Item icon={PLATFORM_META[platform].icon} label={label} portID={portID} iconColor="#369f52" labelVariant={StepLabelVariant.PRIMARY} />
      </Section>
    </Step>
  );
};

const ConnectedInvocationStep: React.FC<ConnectedStepProps & ConnectedInvocationStepProps> = ({ node, platform, projectName, invocationName }) => (
  <InvocationStep platform={platform} portID={node.ports.out[0]} projectName={projectName} invocationName={invocationName} />
);

const mapStateToProps = {
  projectName: Skill.activeProjectNameSelector,
  invocationName: Skill.invNameSelector,
};

type ConnectedInvocationStepProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectedInvocationStep) as React.FC<ConnectedStepProps>;
