import { Models, Node as BaseNode } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { Utils } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Input, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import { CheckboxGroup, CheckboxOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import { NUMBERS_ONLY_REGEXP } from '@/constants';
import { useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FollowPathSection } from '@/pages/Canvas/components/FollowPath';
import NoMatchAndNoReplyList from '@/pages/Canvas/components/NoMatchAndNoReplyList';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Project/contexts';
import { withEnterPress, withInputBlur, withTargetValue } from '@/utils/dom';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import NoReplyTooltip from './NoReplyTooltip';

const ELSE_OPTIONS: CheckboxOption<BaseNode.Utils.NoReplyType>[] = [
  {
    id: BaseNode.Utils.NoReplyType.REPROMPT,
    label: 'Response',
  },
  {
    id: BaseNode.Utils.NoReplyType.PATH,
    label: 'Path',
  },
];

interface NoReplyEditorProps {
  noReply: Realtime.NodeData.NoReply;
  onChange: (noReply: Realtime.NodeData.NoReply) => void;
  pushToPath?: PushToPath;
}

export const NO_REPLY_PATH_PATH_TYPE = 'noReplyPath';

const NoReplyEditor: React.FC<NoReplyEditorProps> = ({ noReply, onChange, pushToPath }) => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;

  const [timeout, setTimeout] = useLinkedState(String(noReply.timeout || getDefaultNoReplyTimeoutSeconds(platform)));

  const onChangeTimeout = (value: string) => {
    if (value !== '' && (!value.match(NUMBERS_ONLY_REGEXP) || value.length > 2)) {
      return;
    }

    setTimeout(value);
  };

  const onChangeType = async (types: BaseNode.Utils.NoReplyType[]) => {
    const prevTypesIncludesPath = noReply.types.includes(BaseNode.Utils.NoReplyType.PATH);
    const newTypesIncludesPath = types.includes(BaseNode.Utils.NoReplyType.PATH);
    const focusedNodeID = engine.focus.getTarget();
    const node = focusedNodeID ? engine.getNodeByID(focusedNodeID) : null;

    const noReplyPortID = node?.ports.out.builtIn[Models.PortType.NO_REPLY];

    if (noReplyPortID && prevTypesIncludesPath && !newTypesIncludesPath) {
      await engine.port.removeOutBuiltIn(Models.PortType.NO_REPLY, noReplyPortID);
    } else if (!noReplyPortID && !prevTypesIncludesPath && newTypesIncludesPath && focusedNodeID) {
      await engine.port.addOutBuiltIn(focusedNodeID, Models.PortType.NO_REPLY);
    }

    onChange({ ...noReply, types });
  };

  const withPath = noReply.types.includes(BaseNode.Utils.NoReplyType.PATH);
  const withReprompt = noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT);

  const withDividers = !!noReply.types.length && withReprompt;
  const isAnyGeneralActivePlatform = isAnyGeneralPlatform(platform);
  const withoutPathAndAlwaysRandom = Realtime.Utils.platform.getPlatformValue(
    platform,
    {
      [Constants.PlatformType.ALEXA]: true,
      [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: true,
      [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: true,
    },
    false
  );

  return (
    <>
      {!withoutPathAndAlwaysRandom && (
        <Section dividers isDividerNested isDividerBottom>
          <FormControl label="No Reply Type" contentBottomUnits={0} tooltip={<NoReplyTooltip />}>
            <CheckboxGroup isFlat options={ELSE_OPTIONS} checked={noReply.types} onChange={onChangeType} />
          </FormControl>
        </Section>
      )}

      <Section dividers={withDividers} isDividerBottom>
        <FormControl label="Time Delay" contentBottomUnits={0}>
          <BoxFlex>
            <TippyTooltip
              title={`This value is not editable as it's defined by ${Utils.platform.getPlatformProviderName(platform)}`}
              disabled={isAnyGeneralActivePlatform}
            >
              <BoxFlex width={52}>
                <Input
                  value={timeout}
                  cursor={isAnyGeneralActivePlatform ? 'auto' : 'not-allowed'}
                  onBlur={() => onChange({ ...noReply, timeout: Number(timeout) })}
                  onChange={withTargetValue(onChangeTimeout)}
                  disabled={!isAnyGeneralActivePlatform}
                  onKeyPress={withEnterPress(withInputBlur())}
                  placeholder="10"
                />
              </BoxFlex>
            </TippyTooltip>

            <Text color={ThemeColor.SECONDARY} ml={16}>
              second delay before no reply response
            </Text>
          </BoxFlex>
        </FormControl>
      </Section>

      {!noReply.types.length ? (
        <Section dividers isDividerBottom customContentStyling={{ color: '#62778c' }}>
          The project will end if no intent is matched.
        </Section>
      ) : (
        <>
          {withReprompt ? (
            <NoMatchAndNoReplyList
              randomize={withoutPathAndAlwaysRandom || noReply.randomize}
              reprompts={noReply.reprompts as any}
              onChangeReprompts={(reprompts: Realtime.NodeData.NoMatch['reprompts']) => onChange({ ...noReply, reprompts: reprompts as any })}
              onChangeRandomize={() => onChange({ ...noReply, randomize: !noReply.randomize })}
              hideRandomizeMenu={withoutPathAndAlwaysRandom}
            >
              {withPath && <FollowPathSection type={NO_REPLY_PATH_PATH_TYPE} pushToPath={pushToPath} />}
            </NoMatchAndNoReplyList>
          ) : (
            <>
              <FollowPathSection type={NO_REPLY_PATH_PATH_TYPE} pushToPath={pushToPath} />
              <Divider offset={0} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default NoReplyEditor;
