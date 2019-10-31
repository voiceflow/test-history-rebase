import { constants } from '@voiceflow/common';
import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import ListManager from '@/components/ListManager';
import { FlexApart } from '@/componentsV2/Flex';
import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';
import { swallowKeyPress } from '@/utils/dom';

import { getSlotKeys } from '../utils';
import Utterance from './Utterance';

const DISALLOWED_CHARACTER_PATTERN = /({{\[)|(].[\dA-Za-z]+}})/g;
const { sampleUtteranceRegex } = constants.regex;

const utteranceFactory = (text) => ({ slots: getSlotKeys(text), text });
const extractUtterance = ({ text }) => text;

const IntentInput = ({ value, platform, onUpdate, onRemove }) => {
  const [nameError, setNameError] = React.useState(null);
  const [formName, updateFormName] = React.useState(value.name);
  const utteranceManager = useManager(value.inputs, (inputs) => onUpdate({ inputs }), { factory: utteranceFactory });

  const toggleCollapse = () => onUpdate({ open: !value.open });
  const updateName = () => {
    if (nameError) return;
    onUpdate({ name: formName });
  };

  const checkName = (e) => {
    const intentName = e.target.value.toLowerCase().replace(/\s/g, '_');
    const re = /^[_a-z]+$/g;

    if (!re.test(intentName) && intentName.length > 0) {
      setNameError('Intent names can only contain lowercase letters and underscores!');
    } else {
      setNameError(null);
    }

    updateFormName(intentName);
  };

  const updateUtterance = (key) => (text) => {
    utteranceManager.onUpdate(key, {
      text,
      slots: getSlotKeys(text),
    });
  };

  let disabled = false;
  if (
    (value.platform === PlatformType.GOOGLE && platform !== PlatformType.GOOGLE) ||
    (value.platform === PlatformType.ALEXA && platform !== PlatformType.ALEXA)
  ) {
    disabled = true;
  }

  const utterances = utteranceManager.items.map(extractUtterance);

  const validate = (text) => {
    const escapedValue = text.replace(DISALLOWED_CHARACTER_PATTERN, '');
    if (escapedValue.match(sampleUtteranceRegex)) {
      return 'Sample utterances can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens';
    }
    if (utterances.includes(text.trim())) {
      return 'Intents can not contain duplicate utterances';
    }
  };

  return (
    <>
      <FlexApart className={cn('intent-title', { faded: disabled })}>
        <span className="collapse-indicator" onClick={toggleCollapse}>
          <i className={cn('fas', 'fa-caret-right', 'rotate', { 'fa-rotate-90': value.open })} />
        </span>
        <Tooltip className="flex-hard" theme="warning" arrow position="bottom-start" open={!!nameError} distance={5} html={nameError}>
          <input
            placeholder="Enter Intent Name"
            type="text"
            value={formName}
            onChange={(e) => {
              checkName(e);
            }}
            onBlur={updateName}
            onKeyPress={swallowKeyPress(13)}
            className="interaction-name-input name-input"
          />
        </Tooltip>
        <Button isClose onClick={onRemove} />
      </FlexApart>
      <Collapse isOpen={value.open}>
        <ListManager
          validate={validate}
          placeholder={value.inputs.length ? 'Enter Synonyms' : 'Enter user reply'}
          {...utteranceManager}
          extractValue={extractUtterance}
          onUpdate={updateUtterance}
          formComponent={Utterance}
          inputComponent={Utterance}
          showHelpText
        />
      </Collapse>
    </>
  );
};

const mapStateToProps = {
  platform: activePlatformSelector,
};

export default connect(mapStateToProps)(IntentInput);
