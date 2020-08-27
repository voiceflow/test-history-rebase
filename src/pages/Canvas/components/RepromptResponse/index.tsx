import { ElseType as InteractionElseType } from '@voiceflow/alexa-types/build/nodes/interaction';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { Node, NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import NoMatchItem from '@/pages/Canvas/components/NoMatchItem';
import SpeakItemList from '@/pages/Canvas/components/SpeakItemList';
import { EngineContext, PlatformContext } from '@/pages/Canvas/contexts';
import { ConnectedProps, MergeArguments } from '@/types';
import { head } from '@/utils/array';

import { NodeEditorPropsType } from '../../managers/types';
import RadiobuttonText from './components/RadiobuttonText';
import RepromptTooltip from './components/RepromptTooltip';
import useCachedUpdate from './hooks/useCachedUpdate';

const MAX_REPROMPTS = 3;
const ELSE_OPTIONS = [
  {
    id: InteractionElseType.PATH,
    label: <RadiobuttonText label="Path" />,
  },
  {
    id: InteractionElseType.REPROMPT,
    label: <RadiobuttonText label="Reprompts" />,
  },
];

const RepromptResponseForm: React.FC<NodeEditorPropsType<NodeData.Interaction> & ConnectedRepromptResponseFormProps> = ({
  data,
  onChange,
  elseLinkID,
}) => {
  const {
    else: { type, randomize, reprompts },
  } = data;

  const platform = React.useContext(PlatformContext)!;
  const engine = React.useContext(EngineContext)!;
  const { cachedData, changeReprompts, changeType, changeRandomize } = useCachedUpdate(onChange, type, randomize, reprompts);

  const handleChangeType = React.useCallback(
    (newType) => {
      if (newType === InteractionElseType.REPROMPT && elseLinkID) {
        // When we switch to reprompt, clean up any links to avoid null reference bugs.
        engine.link.remove(elseLinkID);
      }
      changeType(newType);
    },
    [changeType, elseLinkID]
  );

  return (
    <>
      <Section borderBottom={true}>
        <FormControl label="Else Type" contentBottomUnits={0} tooltip={<RepromptTooltip />} tooltipProps={{ helpTitle: null, helpMessage: null }}>
          <RadioGroup options={ELSE_OPTIONS} checked={type} onChange={handleChangeType} />
        </FormControl>
      </Section>
      {type === InteractionElseType.REPROMPT && (
        <SpeakItemList
          platform={platform}
          changeRandomize={changeRandomize}
          changeSpeakItems={changeReprompts}
          itemComponent={NoMatchItem}
          maxItems={MAX_REPROMPTS}
          speakItems={cachedData.else.data.reprompts}
          randomize={cachedData.else.randomize}
          itemName="reprompts"
        />
      )}
    </>
  );
};

const mapStateToProps = {
  focusedNode: Creator.focusedNodeSelector,
  getLinkIDsByPortID: Creator.linkIDsByPortIDSelector,
};

const getElseLinkID = (focusedNode: Node, getLinkIDsByPortID: (portID: string) => string[]) => {
  const [elsePortID] = head(focusedNode.ports.out);
  return getLinkIDsByPortID(elsePortID)[0];
};

const mergeProps = (
  ...[{ focusedNode, getLinkIDsByPortID }, , ownProps]: MergeArguments<typeof mapStateToProps, {}, NodeEditorPropsType<NodeData.Interaction>>
) => ({
  ...ownProps,
  elseLinkID: getElseLinkID(focusedNode!, getLinkIDsByPortID),
});

type ConnectedRepromptResponseFormProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(RepromptResponseForm as React.FC) as React.FC<NodeEditorPropsType<NodeData.Interaction>>;
