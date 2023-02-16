import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import { CheckboxGroup, CheckboxOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import * as Creator from '@/ducks/creator';
import * as History from '@/ducks/history';
import { useDispatch, useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FollowPathSection } from '@/pages/Canvas/components/FollowPath';
import NoMatchAndNoReplyList from '@/pages/Canvas/components/NoMatchAndNoReplyList';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';

import NoMatchTooltip from './NoMatchTooltip';

const ELSE_OPTIONS: CheckboxOption<BaseNode.Utils.NoMatchType>[] = [
  {
    id: BaseNode.Utils.NoMatchType.REPROMPT,
    label: 'Reprompts',
  },
  {
    id: BaseNode.Utils.NoMatchType.PATH,
    label: 'Path',
  },
];

export interface NoMatchFormProps {
  noMatch: Realtime.NodeData.NoMatch;
  onChange: (noMatch: Realtime.NodeData.NoMatch) => Promise<void>;
  pushToPath?: PushToPath;
}

export const NO_MATCH_PATH_PATH_TYPE = 'noMatchPath';

const NoMatchForm: React.FC<NoMatchFormProps> = ({ onChange, noMatch, pushToPath }) => {
  const engine = React.useContext(EngineContext)!;

  const noMatchLinkID = useSelector(Creator.focusedNoMatchLinkIDSelector);

  const transaction = useDispatch(History.transaction);

  const onChangeType = async (types: BaseNode.Utils.NoMatchType[]) =>
    transaction(async () => {
      if (noMatchLinkID && noMatch.types.includes(BaseNode.Utils.NoMatchType.PATH) && !types.includes(BaseNode.Utils.NoMatchType.PATH)) {
        // When we switch to reprompt, clean up any links to avoid null reference bugs.
        await engine.link.remove(noMatchLinkID);
      }

      await onChange({ ...noMatch, types });
    });

  const withPath = noMatch.types.includes(BaseNode.Utils.NoMatchType.PATH);
  const withReprompt = noMatch.types.includes(BaseNode.Utils.NoMatchType.REPROMPT);

  return (
    <>
      <Section dividers={!!noMatch.types.length && withReprompt} isDividerBottom>
        <FormControl label="No Match Type" contentBottomUnits={0} tooltip={<NoMatchTooltip />}>
          <CheckboxGroup isFlat options={ELSE_OPTIONS} checked={noMatch.types} onChange={onChangeType} />
        </FormControl>
      </Section>

      {!noMatch.types.length ? (
        <>
          <Section customContentStyling={{ color: '#62778c' }}>The assistant will end if no intent is matched.</Section>
          <Divider offset={0} />
        </>
      ) : (
        <>
          {withReprompt ? (
            <NoMatchAndNoReplyList
              {...noMatch}
              onChangeReprompts={(reprompts) => onChange({ ...noMatch, reprompts: reprompts as any })}
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

export default NoMatchForm;
