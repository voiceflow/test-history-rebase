import React from 'react';

import { PluginType } from '@/components/TextEditor';
import { fromTextConvertor } from '@/components/TextEditor/plugins/variables/utils';
import { DisplayType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { allVariablesSelector } from '@/store/selectors';
import { identity } from '@/utils/functional';

export type DisplayStepProps = ConnectedStepProps['stepProps'] & {
  image?: string;
  label?: string;
  portID?: string;
};

export const DisplayStep: React.FC<DisplayStepProps> = ({ label, withPorts, portID, isActive, lockOwner, onClick, image }) => (
  <Step isActive={isActive} onClick={onClick} lockOwner={lockOwner} image={image}>
    <Section>
      <Item
        label={label}
        portID={withPorts ? portID : null}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="blocks"
        iconColor="#3c6997"
        placeholder="Add a multimodal display"
      />
    </Section>
  </Step>
);

export type ConnectedDisplayStepProps = ConnectedStepProps<NodeData.Display> & {
  variables: string[];
};

const ConnectedDisplayStep: React.FC<ConnectedDisplayStepProps> = ({ node, data, stepProps, variables }) => {
  const pluginProps = React.useMemo(
    () => ({
      [PluginType.VARIABLES]: { variables },
    }),
    [variables]
  );
  const formatText = React.useCallback(
    (value) => fromTextConvertor()(pluginProps)(identity)(value, { cursor: '', entityMap: {}, entityRanges: [] }),
    [data]
  );

  const label = data.displayType === DisplayType.SPLASH ? formatText(data.splashHeader) : data.jsonFileName;

  return <DisplayStep portID={node.ports.out[0]} label={label} {...stepProps} image={data.backgroundImage} />;
};

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(ConnectedDisplayStep);
