import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { ChoiceElseType } from '@/constants';
import { NodeData } from '@/models';
import { FormControl } from '@/pages/Canvas/components/Editor';
import NoMatchItem from '@/pages/Canvas/components/NoMatchItem';
import SpeakItemList from '@/pages/Canvas/components/SpeakItemList';
import { PlatformContext } from '@/pages/Canvas/contexts';

import RadiobuttonText from './components/RadiobuttonText';
import RepromptTooltip from './components/RepromptTooltip';
import useCachedUpdate from './hooks/useCachedUpdate';

const ELSE_OPTIONS = [
  {
    id: ChoiceElseType.PATH,
    label: <RadiobuttonText label="Path" />,
  },
  {
    id: ChoiceElseType.REPROMPT,
    label: <RadiobuttonText label="Reprompts" />,
  },
];

const MAX_REPROMPTS = 3;

export type RepromptResponseFormProps = {
  data: NodeData.Interaction;
  onChange: (newState: Partial<NodeData.Interaction>) => void;
};

export const RepromptResponseForm = ({ data, onChange }: RepromptResponseFormProps) => {
  const {
    else: { type, randomize, reprompts },
  } = data;

  const platform = React.useContext(PlatformContext)!;
  const { cachedData, changeReprompts, changeType, changeRandomize } = useCachedUpdate(onChange, type, randomize, reprompts);

  return (
    <>
      <Section borderBottom={true}>
        <FormControl label="Else Type" contentBottomUnits={0} tooltip={<RepromptTooltip />} tooltipProps={{ helpTitle: null, helpMessage: null }}>
          <RadioGroup options={ELSE_OPTIONS} checked={type} onChange={changeType} />
        </FormControl>
      </Section>
      {type === ChoiceElseType.REPROMPT && (
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
