import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Divider, Input, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { CheckboxGroup, CheckboxOption } from '@/components/RadioGroup';
import Section from '@/components/Section';
import { NUMBERS_ONLY_REGEXP } from '@/constants';
import * as History from '@/ducks/history';
import { useActiveProjectPlatformConfig, useDispatch, useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import { FollowPathSection } from '@/pages/Canvas/components/FollowPath';
import NoMatchAndNoReplyList from '@/pages/Canvas/components/NoMatchAndNoReplyList';
import { EngineContext } from '@/pages/Canvas/contexts';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { withInputBlur } from '@/utils/dom';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';

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

export interface NoReplyFormProps {
  noReply: Realtime.NodeData.NoReply;
  onChange: (noReply: Realtime.NodeData.NoReply) => Promise<void>;
  pushToPath?: PushToPath;
}

export const NO_REPLY_PATH_PATH_TYPE = 'noReplyPath';

const NoReplyForm: React.FC<NoReplyFormProps> = ({ noReply, onChange, pushToPath }) => {
  const platformConfig = useActiveProjectPlatformConfig();

  const engine = React.useContext(EngineContext)!;

  const [timeout, setTimeout] = useLinkedState(String(noReply.timeout || getDefaultNoReplyTimeoutSeconds(platformConfig.type)));

  const transaction = useDispatch(History.transaction);

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
    const node = engine.getNodeByID(focusedNodeID);

    const noReplyPortID = node?.ports.out.builtIn[BaseModels.PortType.NO_REPLY];

    await transaction(async () => {
      if (noReplyPortID && prevTypesIncludesPath && !newTypesIncludesPath) {
        await engine.port.removeBuiltin(noReplyPortID);
      } else if (!noReplyPortID && !prevTypesIncludesPath && newTypesIncludesPath && focusedNodeID) {
        await engine.port.addBuiltin(focusedNodeID, BaseModels.PortType.NO_REPLY);
      }

      await onChange({ ...noReply, types });
    });
  };

  const withPath = noReply.types.includes(BaseNode.Utils.NoReplyType.PATH);
  const withReprompt = noReply.types.includes(BaseNode.Utils.NoReplyType.REPROMPT);

  const withDividers = !!noReply.types.length && withReprompt;
  const isDelayEditable = Realtime.Utils.typeGuards.isPlatformWithEditableNoReplyDelay(platformConfig.type);
  const withoutPathAndAlwaysRandom = Realtime.Utils.platform.createPlatformSelector(
    { [Platform.Constants.PlatformType.ALEXA]: true },
    false
  )(platformConfig.type);

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
            <TippyTooltip content={`This value is not editable as it's defined by ${platformConfig.name}`} disabled={isDelayEditable}>
              <BoxFlex width={52}>
                <Input
                  value={timeout}
                  cursor={isDelayEditable ? 'auto' : 'not-allowed'}
                  onBlur={() => onChange({ ...noReply, timeout: Number(timeout) })}
                  disabled={!isDelayEditable}
                  placeholder="10"
                  onEnterPress={withInputBlur()}
                  onChangeText={onChangeTimeout}
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
          The assistant will end if no intent is matched.
        </Section>
      ) : (
        <>
          {withReprompt ? (
            <NoMatchAndNoReplyList
              randomize={withoutPathAndAlwaysRandom || noReply.randomize}
              reprompts={noReply.reprompts as any}
              isNoReply
              onChangeReprompts={(reprompts) => onChange({ ...noReply, reprompts } as Realtime.NodeData.NoReply)}
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

export default NoReplyForm;
