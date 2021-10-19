import { Node as BaseNode } from '@voiceflow/base-types';
import React from 'react';

import { CheckboxType } from '@/components/Checkbox';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useLinkedState } from '@/hooks';
import { Node, NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import NoMatchPath from '@/pages/Canvas/components/NoMatchPath';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Skill/contexts';
import { ConnectedProps, MergeArguments } from '@/types';
import { head } from '@/utils/array';
import { isChatbotPlatform } from '@/utils/typeGuards';

import RadioButtonText from '../RadioButtonText';
import { ChatNoMatchList, NoMatchTooltip, VoiceNoMatchList } from './components';

export { NO_MATCH_PATH_TYPE, default as NoMatchSection } from './components/NoMatchSection';

const ELSE_OPTIONS: RadioOption<BaseNode.Utils.NoMatchType>[] = [
  {
    id: BaseNode.Utils.NoMatchType.REPROMPT,
    label: <RadioButtonText label="Reprompts" />,
    customCheckedCondition: (type) => type === BaseNode.Utils.NoMatchType.REPROMPT || type === BaseNode.Utils.NoMatchType.BOTH,
  },
  {
    id: BaseNode.Utils.NoMatchType.PATH,
    label: <RadioButtonText label="Path" />,
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

  const renderList = () => {
    const children = localNoMatches.type === BaseNode.Utils.NoMatchType.BOTH && <NoMatchPath pushToPath={pushToPath} />;

    if (isChatbotPlatform(platform)) {
      return (
        <ChatNoMatchList
          {...(localNoMatches as NodeData.ChatNoMatches)}
          onChangeRandomize={() => setLocalNoMatches({ ...localNoMatches, randomize: !localNoMatches.randomize })}
          onChangeReprompts={(reprompts) => setLocalNoMatches({ ...localNoMatches, reprompts })}
        >
          {children}
        </ChatNoMatchList>
      );
    }

    return (
      <VoiceNoMatchList
        {...(localNoMatches as NodeData.VoiceNoMatches)}
        platform={platform}
        onChangeReprompts={(reprompts) => setLocalNoMatches({ ...localNoMatches, reprompts })}
        onChangeRandomize={(randomize) => setLocalNoMatches({ ...localNoMatches, randomize })}
      >
        {children}
      </VoiceNoMatchList>
    );
  };

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
        <>{localNoMatches.type !== BaseNode.Utils.NoMatchType.PATH ? renderList() : <NoMatchPath pushToPath={pushToPath} borderBottom />}</>
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
