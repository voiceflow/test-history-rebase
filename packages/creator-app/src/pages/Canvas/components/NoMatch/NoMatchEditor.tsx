import { Node as BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { CheckboxType } from '@/components/Checkbox';
import Divider from '@/components/Divider';
import RadioGroup, { RadioOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FollowPathSection } from '@/pages/Canvas/components/FollowPath';
import NoMatchAndNoReplyList from '@/pages/Canvas/components/NoMatchAndNoReplyList';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';

import NoMatchTooltip from './NoMatchTooltip';

const ELSE_OPTIONS: RadioOption<BaseNode.Utils.NoMatchType>[] = [
  {
    id: BaseNode.Utils.NoMatchType.REPROMPT,
    label: 'Reprompts',
    customCheckedCondition: (type) => type === BaseNode.Utils.NoMatchType.REPROMPT || type === BaseNode.Utils.NoMatchType.BOTH,
  },
  {
    id: BaseNode.Utils.NoMatchType.PATH,
    label: 'Path',
    customCheckedCondition: (type) => type === BaseNode.Utils.NoMatchType.PATH || type === BaseNode.Utils.NoMatchType.BOTH,
  },
];

interface NoMatchEditorProps {
  noMatch: Realtime.NodeData.NoMatch;
  onChange: (noMatch: Realtime.NodeData.NoMatch) => void;
  pushToPath?: PushToPath;
}

export const NO_MATCH_PATH_PATH_TYPE = 'noMatchPath';

const NoMatchEditor: React.FC<NoMatchEditorProps> = ({ onChange, noMatch, pushToPath }) => {
  const engine = React.useContext(EngineContext)!;

  const noMatchLinkID = useSelector(Creator.focusedNoMatchLinkIDSelector);

  const onChangeType = (newType: BaseNode.Utils.NoMatchType) => {
    let type: BaseNode.Utils.NoMatchType | null;
    let removeLink = false;

    if (noMatch.type === BaseNode.Utils.NoMatchType.BOTH) {
      if (newType === BaseNode.Utils.NoMatchType.PATH) {
        type = BaseNode.Utils.NoMatchType.REPROMPT;
        removeLink = !!noMatchLinkID;
      } else {
        type = BaseNode.Utils.NoMatchType.PATH;
      }
    } else if (newType === noMatch.type) {
      type = null;
    } else if (!noMatch.type) {
      type = newType;
    } else {
      type = BaseNode.Utils.NoMatchType.BOTH;
    }

    if (removeLink && noMatchLinkID) {
      // When we switch to reprompt, clean up any links to avoid null reference bugs.
      engine.link.remove(noMatchLinkID);
    }

    onChange({ ...noMatch, type });
  };

  const withPath = noMatch.type === BaseNode.Utils.NoMatchType.PATH || noMatch.type === BaseNode.Utils.NoMatchType.BOTH;
  const withReprompt = noMatch.type === BaseNode.Utils.NoMatchType.REPROMPT || noMatch.type === BaseNode.Utils.NoMatchType.BOTH;

  return (
    <>
      <Section borderBottom={!!noMatch.type && noMatch.type !== BaseNode.Utils.NoMatchType.PATH}>
        <FormControl label="No Match Type" contentBottomUnits={0} tooltip={<NoMatchTooltip />}>
          <RadioGroup isFlat type={CheckboxType.CHECKBOX} options={ELSE_OPTIONS} checked={noMatch.type!} onChange={onChangeType} />
        </FormControl>
      </Section>

      {!noMatch.type ? (
        <>
          <Section customContentStyling={{ color: '#62778c' }}>The project will end if no intent is matched.</Section>
          <Divider offset={0} />
        </>
      ) : (
        <>
          {withReprompt ? (
            <NoMatchAndNoReplyList
              {...noMatch}
              onChangeReprompts={(reprompts: Realtime.NodeData.NoMatch['reprompts']) => onChange({ ...noMatch, reprompts: reprompts as any })}
              onChangeRandomize={() => onChange({ ...noMatch, randomize: !noMatch.randomize })}
            >
              {withPath && <FollowPathSection type={NO_MATCH_PATH_PATH_TYPE} pushToPath={pushToPath} />}
            </NoMatchAndNoReplyList>
          ) : (
            <>
              <FollowPathSection type={NO_MATCH_PATH_PATH_TYPE} pushToPath={pushToPath} />
              <Divider offset={0} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default NoMatchEditor;
