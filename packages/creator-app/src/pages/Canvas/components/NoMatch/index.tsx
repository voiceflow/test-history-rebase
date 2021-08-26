import { Node as BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { CheckboxType } from '@/components/Checkbox';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import { MAX_ALEXA_REPROMPTS, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useLinkedState } from '@/hooks';
import { Node, NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import NoMatchItem from '@/pages/Canvas/components/NoMatchItem';
import NoMatchPath from '@/pages/Canvas/components/NoMatchPath';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Skill/contexts';
import { ConnectedProps, MergeArguments } from '@/types';
import { head } from '@/utils/array';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import NoMatchTooltip from './components/NoMatchTooltip';
import RadiobuttonText from './components/RadiobuttonText';

export { NO_MATCH_PATH_TYPE, default as NoMatchSection } from './components/NoMatchSection';

const ELSE_OPTIONS: RadioOption<BaseNode.Utils.NoMatchType>[] = [
  {
    id: BaseNode.Utils.NoMatchType.REPROMPT,
    label: <RadiobuttonText label="Reprompts" />,
    customCheckedCondition: (type) => type === BaseNode.Utils.NoMatchType.REPROMPT || type === BaseNode.Utils.NoMatchType.BOTH,
  },
  {
    id: BaseNode.Utils.NoMatchType.PATH,
    label: <RadiobuttonText label="Path" />,
    customCheckedCondition: (type) => type === BaseNode.Utils.NoMatchType.PATH || type === BaseNode.Utils.NoMatchType.BOTH,
  },
];

interface NoMatchProps {
  onChange: (noMatches: NodeData.NoMatches) => void;
  noMatches: NodeData.NoMatches;
  pushToPath?: PushToPath;
}

const NoMatch: React.FC<NoMatchProps & ConnectedNoMatchProps> = ({ onChange, noMatches, elseLinkID, pushToPath }) => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;

  const [localNoMatches, setLocalNoMatches] = useLinkedState(noMatches);

  const handleChangeType = (newType: BaseNode.Utils.NoMatchType) => {
    let nextType: BaseNode.Utils.NoMatchType | null;
    let removeLink = false;

    if (localNoMatches.type === BaseNode.Utils.NoMatchType.BOTH) {
      if (newType === BaseNode.Utils.NoMatchType.PATH) {
        nextType = BaseNode.Utils.NoMatchType.REPROMPT;
        removeLink = !!elseLinkID;
      } else {
        nextType = BaseNode.Utils.NoMatchType.PATH;
      }
    } else if (newType === localNoMatches.type) {
      nextType = null;
    } else if (!localNoMatches.type) {
      nextType = newType;
    } else {
      nextType = BaseNode.Utils.NoMatchType.BOTH;
    }

    if (removeLink) {
      // When we switch to reprompt, clean up any links to avoid null reference bugs.
      engine.link.remove(elseLinkID);
    }

    setLocalNoMatches({ ...localNoMatches, type: nextType });
  };

  useDidUpdateEffect(() => {
    if (localNoMatches !== noMatches) {
      onChange(localNoMatches);
    }
  }, [localNoMatches]);

  return (
    <>
      <Section borderBottom={!!localNoMatches.type && localNoMatches.type !== BaseNode.Utils.NoMatchType.PATH}>
        <FormControl label="No Match Type" contentBottomUnits={0} tooltip={<NoMatchTooltip />}>
          <RadioGroup type={CheckboxType.CHECKBOX} options={ELSE_OPTIONS} checked={localNoMatches.type!} onChange={handleChangeType} />
        </FormControl>
      </Section>

      {localNoMatches.type === null ? (
        <Section borderBottom customContentStyling={{ color: '#62778c' }}>
          The project will end if no intent is matched.
        </Section>
      ) : (
        <>
          {localNoMatches.type !== BaseNode.Utils.NoMatchType.PATH ? (
            <SpeakAudioList
              items={localNoMatches.reprompts}
              platform={platform}
              maxItems={isAnyGeneralPlatform(platform) ? MAX_SPEAK_ITEMS_COUNT : MAX_ALEXA_REPROMPTS}
              itemName="reprompts"
              randomize={localNoMatches.randomize}
              itemComponent={NoMatchItem}
              onChangeItems={(reprompts) => setLocalNoMatches({ ...localNoMatches, reprompts })}
              onChangeRandomize={(randomize) => setLocalNoMatches({ ...localNoMatches, randomize })}
            >
              {localNoMatches.type === BaseNode.Utils.NoMatchType.BOTH && <NoMatchPath pushToPath={pushToPath} />}
            </SpeakAudioList>
          ) : (
            <NoMatchPath pushToPath={pushToPath} borderBottom />
          )}
        </>
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

const mergeProps = (...[{ focusedNode, getLinkIDsByPortID }, , ownProps]: MergeArguments<typeof mapStateToProps, {}, NoMatchProps>) => ({
  ...ownProps,
  elseLinkID: getElseLinkID(focusedNode!, getLinkIDsByPortID),
});

type ConnectedNoMatchProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(NoMatch as React.FC) as React.FC<NoMatchProps>;
